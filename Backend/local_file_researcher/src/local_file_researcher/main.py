from pathlib import Path
from uuid import uuid4

from local_file_researcher.crew import LocalFileResearcher

BACKEND_DIR = Path(__file__).resolve().parents[2]


def main():
    documents_dir = BACKEND_DIR / "documents"
    pdf_files = list(documents_dir.glob("*.pdf"))

    if not pdf_files:
        raise FileNotFoundError("No PDF files found.")

    pdf_path = max(
        pdf_files,
        key=lambda path: path.stat().st_mtime,
    )

    print(f"Testing PDF: {pdf_path.name}")

    researcher = LocalFileResearcher()
    result, report_path = researcher.kickoff(
        pdf_path.name,
        str(uuid4()),
    )

    print("\n========== FINAL REPORT ==========\n")
    print(result)
    print(f"\nSaved to: {report_path}")


if __name__ == "__main__":
    main()
