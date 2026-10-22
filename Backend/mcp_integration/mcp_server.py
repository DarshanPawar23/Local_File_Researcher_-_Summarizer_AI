import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from mcp.server.fastmcp import FastMCP
from utils.pdf_reader import read_pdf

mcp = FastMCP("local-file-researcher")

DOCUMENTS_DIR = (BASE_DIR / "documents").resolve()
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)


@mcp.tool()
def read_file(file_path: str) -> str:
    """Read a PDF file located inside the documents directory."""
    supplied_path = Path(file_path)

    if supplied_path.is_absolute():
        resolved_path = supplied_path.resolve()
    else:
        resolved_path = (DOCUMENTS_DIR / supplied_path).resolve()

    if not resolved_path.is_relative_to(DOCUMENTS_DIR):
        raise ValueError("Access denied: file must be inside documents.")

    if resolved_path.suffix.lower() != ".pdf":
        raise ValueError("Only PDF files are supported.")

    if not resolved_path.is_file():
        raise FileNotFoundError(
            f"PDF file not found: {resolved_path.name}"
        )

    try:
        return read_pdf(str(resolved_path))
    except Exception as exc:
        raise ValueError(
            f"Could not read PDF: {resolved_path.name}"
        ) from exc


if __name__ == "__main__":
    mcp.run(transport="stdio")