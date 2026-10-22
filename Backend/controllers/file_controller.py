
import sys
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from starlette.concurrency import run_in_threadpool


# --------------------------------------------------
# 1. Project paths and configuration
# --------------------------------------------------

BACKEND_DIR = Path(__file__).resolve().parent.parent
DOCUMENTS_DIR = BACKEND_DIR / "documents"
OUTPUT_DIR = BACKEND_DIR / "outputs"

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# 2. Import CrewAI project
# --------------------------------------------------

CREWAI_SRC = BACKEND_DIR / "local_file_researcher" / "src"

if str(CREWAI_SRC) not in sys.path:
    sys.path.insert(0, str(CREWAI_SRC))

from local_file_researcher.crew import LocalFileResearcher


# --------------------------------------------------
# 3. PDF upload and research controller
# --------------------------------------------------

async def research_pdf(file: UploadFile) -> dict:
    # Validate filename and extension.
    if not file.filename or Path(file.filename).suffix.lower() != ".pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed.",
        )

    report_id = str(uuid.uuid4())
    saved_filename = f"{report_id}.pdf"
    file_path = DOCUMENTS_DIR / saved_filename

    total_size = 0

    try:
        # Save the uploaded PDF in chunks.
        with file_path.open("wb") as destination:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="PDF must be 20 MB or smaller.",
                    )

                destination.write(chunk)

        # Reject empty files.
        if total_size == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded PDF is empty.",
            )

        # Basic PDF signature validation.
        with file_path.open("rb") as source:
            if source.read(5) != b"%PDF-":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The uploaded file is not a valid PDF.",
                )

        # Run the CrewAI/MCP workflow.
        researcher = LocalFileResearcher()

        result, report_path = await run_in_threadpool(
            researcher.kickoff,
            saved_filename,
            report_id,
        )

        # Verify that the current report exists.
        report_path = Path(report_path).resolve()

        if not report_path.is_relative_to(OUTPUT_DIR.resolve()):
            raise RuntimeError(
                "The generated report path is outside the outputs directory."
            )

        if not report_path.is_file():
            raise RuntimeError(
                "The report file was not created."
            )

        if report_path.stat().st_size == 0:
            raise RuntimeError(
                "The generated report is empty."
            )

        # Return the generated report and its actual path.
        return {
            "report_id": report_id,
            "filename": file.filename,
            "status": "completed",
            "report": str(result),
            "report_path": str(report_path),
        }

    except HTTPException:
        file_path.unlink(missing_ok=True)
        raise

    except Exception as exc:
        # Do not report success when extraction or generation fails.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF research failed: {exc}",
        ) from exc

    finally:
        await file.close()
