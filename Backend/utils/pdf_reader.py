
import pymupdf

def read_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file using PyMuPDF.

    Args:
        file_path: Path to the PDF file.

    Returns:
        Extracted text from all PDF pages as a single string.
    """

    with pymupdf.open(file_path) as pdf:

        pages_text = [
            page.get_text()
            for page in pdf
        ]

    extracted_text = "\n".join(pages_text)

    if not extracted_text.strip():
        raise ValueError(
            "No extractable text found in the PDF."
        )

    return extracted_text
