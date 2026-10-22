# Local File Researcher & Summarizer AI

An AI-powered document analysis application that transforms lengthy PDF documents into structured, readable research reports. Upload a PDF through the web interface, let the backend extract its content, and generate an AI-written report that helps you understand the important information without reading the entire document manually.

The project combines a React frontend, a FastAPI backend, MCP-based document reading, and an LLM-powered report-generation workflow.

## Overview

Reading and understanding long documents can be time-consuming, especially when the information is spread across multiple sections. This project aims to make that process simpler by automating PDF text extraction and report generation.

Users can upload a PDF, start the analysis, and view the generated report directly in the browser. The report can also be downloaded as a Markdown file for future reference.

The application is designed with a modular backend so document processing and AI report generation can be developed and maintained independently of the frontend.

## Features

- **PDF Upload:** Upload PDF documents through a simple, responsive web interface.
- **Document Validation:** Validate uploaded files before processing, including file type and size checks.
- **PDF Text Extraction:** Extract selectable text from PDF documents using PyMuPDF.
- **MCP Integration:** Use a Model Context Protocol (MCP) server to expose document-reading functionality as a tool.
- **AI-Powered Report Generation:** Use an LLM through CrewAI and a supported Groq model to generate a structured report from the extracted document content.
- **Structured Output:** Organize the generated content into readable sections, such as summaries, key information, projects, and other relevant details depending on the source document.
- **Report Storage:** Save generated reports in Markdown format.
- **Report Preview:** Display the generated report in the React frontend.
- **Report Download:** Download the generated report as a `.md` file.
- **REST API:** Expose document research functionality through FastAPI.
- **Separation of Concerns:** Keep upload handling, document reading, AI processing, and frontend presentation in separate modules.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript
- Fetch API

### Backend
- Python
- FastAPI
- Uvicorn
- PyMuPDF
- Python `asyncio` thread-pool integration where needed

### AI and Document Processing
- CrewAI
- Groq API
- Large Language Models (LLMs)
- Model Context Protocol (MCP)

### Development Tools
- Git and GitHub
- VS Code
- Swagger UI / FastAPI OpenAPI documentation
- `uv` for Python dependency and environment management
- npm for frontend dependencies

## How It Works

The application follows a straightforward document-processing workflow.

1. **Upload:** The user selects a PDF through the React interface.
2. **Validate:** The frontend performs basic file checks, and the backend validates the uploaded document.
3. **Save:** The backend saves the uploaded PDF in the documents directory with a unique filename.
4. **Extract:** The MCP document-reading tool reads the PDF and extracts its text using PyMuPDF.
5. **Analyze:** The extracted text is passed to the AI report-generation workflow.
6. **Generate:** The LLM produces a structured report based on the extracted document content.
7. **Store:** The generated report is saved as a Markdown file in the backend outputs directory.
8. **Display:** The API returns the report to the frontend, where the user can read and download it.

### Architecture

```text
                    USER
                     |
                     v
             React + Tailwind CSS
                     |
                     | PDF upload
                     v
                FastAPI API
                     |
                     v
             File Upload Controller
                     |
                     v
              PDF Storage
                     |
                     v
                MCP Server
                     |
                     v
             PyMuPDF Text Extraction
                     |
                     v
          Extracted Document Content
                     |
                     v
          CrewAI / LLM Report Generation
                     |
                     v
             Markdown Report
                     |
              +------+------+
              |             |
              v             v
        Output Storage   API Response
                            |
                            v
                    Report Preview UI
                            |
                            v
                    Download Markdown
```

## Project Structure

```text
Local_File_Researcher_&_Summarizer_AI/
│
├── Backend/
│   ├── controllers/
│   │   └── file_controller.py
│   │
│   ├── documents/
│   │   └── Uploaded PDF files
│   │
│   ├── local_file_researcher/
│   │   └── src/
│   │       └── local_file_researcher/
│   │           ├── crew.py
│   │           └── config/
│   │               ├── agents.yaml
│   │               └── tasks.yaml
│   │
│   ├── mcp_integration/
│   │   ├── mcp_server.py
│   │   └── mcp_client.py
│   │
│   ├── outputs/
│   │   └── Generated Markdown reports
│   │
│   ├── routes/
│   │   └── file_routes.py
│   │
│   ├── utils/
│   │   └── pdf_reader.py
│   │
│   ├── .env
│   ├── .gitignore
│   ├── main.py
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── uv.lock
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

*The structure above represents the main project modules. Some files or directories may differ depending on your current implementation.*

## Prerequisites

Install the following before running the project:

- Python 3.11 or another Python version supported by your installed dependencies
- Node.js and npm
- `uv`
- A Groq API key
- Git (optional, for version control)

Check your installations:

```bash
python --version
node --version
npm --version
uv --version
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd Local_File_Researcher_&_Summarizer_AI
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Set up the backend

Open a terminal and navigate to the backend directory:

```bash
cd Backend
```

Install the project dependencies:

```bash
uv sync
```

If your project uses `requirements.txt` as its dependency source instead, use:

```bash
uv pip install -r requirements.txt
```

Create a `.env` file inside `Backend/` and configure your Groq credentials:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_supported_groq_model
```

Use a model ID supported by your Groq account and the LLM integration configured in your code.

**Security:** Keep `.env` out of version control. Never publish API keys in your repository.

### 3. Start the backend

From the `Backend` directory, run:

```bash
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Once the server starts, open the API documentation:

http://127.0.0.1:8000/docs

Swagger UI lets you inspect the available endpoints and test PDF uploads.

### 4. Set up the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

http://localhost:5173/

If your Windows project path contains spaces or special characters that interfere with npm's command execution, use a project directory path without those characters or configure the Vite script appropriately.

## API Documentation

### Upload a PDF for Research

**Endpoint**

```http
POST /api/files/research
```

**Content type**

```http
multipart/form-data
```

**Request parameter**

| Parameter | Type | Description |
|---|---|---|
| `file` | File | PDF document to analyze |

The uploaded PDF is sent in a multipart form field named `file`.

### Example using cURL

```bash
curl -X POST "http://127.0.0.1:8000/api/files/research" \
  -F "file=@sample.pdf"
```

### Response

The endpoint returns a JSON response containing the processing status, generated report, and report location or identifier, depending on the backend response schema.

A successful response follows this general structure:

```json
{
  "status": "completed",
  "report_id": "generated-report-id",
  "original_filename": "sample.pdf",
  "report": "# Document Research Report\n\nGenerated report content...",
  "report_path": "path-to-generated-report.md"
}
```

The example above illustrates the response format. Exact values and fields depend on the current implementation.

## Error Handling

The application should handle common upload and processing errors, including:

- Unsupported file formats
- Empty or invalid PDF files
- Files exceeding the configured size limit
- PDFs without extractable text
- Missing or invalid LLM credentials
- LLM provider errors or rate limits
- Missing generated report files
- Backend connectivity and CORS errors

Scanned PDFs that contain only images may require OCR before their text can be analyzed.

## Security Considerations

- Store API keys in environment variables rather than source code.
- Validate uploaded files on the backend.
- Apply file-size limits before processing.
- Restrict document-reading tools to the intended document directory.
- Avoid exposing sensitive filesystem paths in public API responses.
- Keep uploaded documents and generated reports out of Git unless they are intentionally included.
- Configure CORS to allow only the frontend origins required by the application.
- Review document retention and deletion policies before handling confidential documents.

## Current Scope

The current application focuses on processing one uploaded PDF at a time, extracting its text, generating a structured AI report, and returning the result to the frontend.

The extraction pipeline uses PyMuPDF for selectable PDF text. Image-only scanned documents may need an OCR integration. The quality of the report depends on the extracted text, prompt design, model capability, and provider availability.

## Future Improvements

Potential enhancements include:

- Support for scanned PDFs through OCR.
- Streaming report generation for faster feedback.
- More detailed progress updates during processing.
- Search and question-answering over document content.
- Support for multiple document formats.
- Document history and report management.
- Improved Markdown rendering and export to PDF or DOCX.
- Authentication and per-user document storage.
- Background processing for large documents.
- Unit and integration tests for the upload, extraction, and report-generation pipeline.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the relevant functionality.
5. Open a pull request with a clear description of the changes.

## License

Choose and add an appropriate open-source license before distributing this project publicly. If no license has been added, all rights remain with the copyright holder by default.

---

**Local File Researcher & Summarizer AI**  
*Making long documents easier to understand, one PDF at a time.*
