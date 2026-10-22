
import os
import sys
import uuid
from pathlib import Path

import yaml
from dotenv import load_dotenv
from crewai import Agent, Crew, LLM, Process, Task
from crewai_tools import MCPServerAdapter
from mcp import StdioServerParameters


# --------------------------------------------------
# 1. Project paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
CONFIG_DIR = BASE_DIR / "config"

# BASE_DIR:
# Backend/local_file_researcher/src/local_file_researcher
BACKEND_DIR = BASE_DIR.parents[2]

MCP_SERVER_PATH = (
    BACKEND_DIR / "mcp_integration" / "mcp_server.py"
)

OUTPUT_DIR = BACKEND_DIR / "outputs"
DOCUMENTS_DIR = BACKEND_DIR / "documents"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# 2. Load Groq configuration
# --------------------------------------------------

load_dotenv(BACKEND_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b",
)

if not GROQ_API_KEY:
    raise ValueError(
        f"GROQ_API_KEY not found in {BACKEND_DIR / '.env'}"
    )

if not MCP_SERVER_PATH.is_file():
    raise FileNotFoundError(
        f"MCP server not found: {MCP_SERVER_PATH}"
    )


# --------------------------------------------------
# 3. Load CrewAI YAML configuration
# --------------------------------------------------

with open(CONFIG_DIR / "agents.yaml", encoding="utf-8") as file:
    AGENTS_CONFIG = yaml.safe_load(file)

with open(CONFIG_DIR / "tasks.yaml", encoding="utf-8") as file:
    TASKS_CONFIG = yaml.safe_load(file)

if not isinstance(AGENTS_CONFIG, dict):
    raise ValueError("agents.yaml must contain a YAML mapping.")

if not isinstance(TASKS_CONFIG, dict):
    raise ValueError("tasks.yaml must contain a YAML mapping.")

for key in ("reader", "writer"):
    if key not in AGENTS_CONFIG:
        raise ValueError(f"Missing '{key}' in agents.yaml")

for key in ("read_pdf_task", "write_report_task"):
    if key not in TASKS_CONFIG:
        raise ValueError(f"Missing '{key}' in tasks.yaml")


class LocalFileResearcher:

    def __init__(self):
        # Groq LLM
        self.llm = LLM(
            model=f"groq/{GROQ_MODEL}",
            api_key=GROQ_API_KEY,
        )

    # --------------------------------------------------
    # 4. Create a writer crew using extracted PDF text
    # --------------------------------------------------

    def generate_report(
        self,
        extracted_text: str,
        report_id: str,
    ):
        if not isinstance(extracted_text, str):
            raise TypeError("MCP returned a non-text result.")

        if not extracted_text.strip():
            raise ValueError(
                "No extractable PDF text was returned by MCP."
            )

        writer = Agent(
            config=AGENTS_CONFIG["writer"],
            llm=self.llm,
            verbose=True,
        )

        report_filename = f"{report_id}.md"
        report_path = OUTPUT_DIR / report_filename

        # Pass the extracted source text directly to the writer.
        write_task = Task(
            description=(
                "Create a Markdown report based ONLY on the PDF "
                "text supplied in the extracted_text input.\n\n"
                "Requirements:\n"
                "1. Identify the actual subject of the source.\n"
                "2. Use a title and sections that match the source.\n"
                "3. Preserve important facts, definitions, figures, "
                "equations and conclusions found in the text.\n"
                "4. Do not invent facts, statistics, citations or "
                "references.\n"
                "5. Do not use external knowledge to fill gaps.\n"
                "6. If the text is incomplete, disclose this clearly.\n"
                "7. If the source is insufficient, explain the "
                "limitation rather than creating an unrelated report.\n\n"
                "PDF TEXT START\n"
                "{extracted_text}\n"
                "PDF TEXT END"
            ),
            expected_output=(
                "A structured Markdown report with a title, executive "
                "summary, main topics, source-supported facts and "
                "conclusion where appropriate."
            ),
            agent=writer,
            output_file=f"outputs/{report_filename}",
        )

        crew = Crew(
            agents=[writer],
            tasks=[write_task],
            process=Process.sequential,
            verbose=True,
        )

        result = crew.kickoff(
            inputs={"extracted_text": extracted_text}
        )

        if not report_path.is_file():
            raise RuntimeError(
                "CrewAI finished without creating the report file."
            )

        if report_path.stat().st_size == 0:
            raise RuntimeError("The generated report is empty.")

        return result, report_path

    # --------------------------------------------------
    # 5. Read PDF using the MCP tool, then generate report
    # --------------------------------------------------

    def kickoff(
        self,
        file_path: str,
        report_id: str | None = None,
    ):
        # Validate the supplied filename against documents/.
        supplied_path = Path(file_path)

        if supplied_path.is_absolute() or supplied_path.name != file_path:
            raise ValueError(
                "Pass only a PDF filename inside the documents folder."
            )

        if supplied_path.suffix.lower() != ".pdf":
            raise ValueError("Only PDF files are supported.")

        pdf_path = (DOCUMENTS_DIR / supplied_path).resolve()

        if not pdf_path.is_relative_to(DOCUMENTS_DIR.resolve()):
            raise ValueError("Access denied: PDF must be in documents.")

        if not pdf_path.is_file():
            raise FileNotFoundError(
                f"PDF not found: {pdf_path.name}"
            )

        report_id = report_id or str(uuid.uuid4())

        # Start MCP server and discover its tools.
        server_params = StdioServerParameters(
            command=sys.executable,
            args=[str(MCP_SERVER_PATH)],
            env=os.environ.copy(),
        )

        with MCPServerAdapter(server_params) as tools:
            read_file_tool = next(
                (
                    tool
                    for tool in tools
                    if tool.name == "read_file"
                ),
                None,
            )

            if read_file_tool is None:
                raise RuntimeError(
                    "MCP read_file tool was not found."
                )

            print(f"Extracting PDF: {pdf_path.name}")

            # Extraction happens here, not inside the writer LLM.
            extracted_text = read_file_tool.run(
                file_path=pdf_path.name
            )

            if not isinstance(extracted_text, str):
                raise TypeError(
                    "MCP read_file did not return plain text."
                )

            if not extracted_text.strip():
                raise ValueError(
                    "The PDF reader returned empty text. "
                    "A scanned PDF may require OCR."
                )

            print(
                f"Extracted {len(extracted_text)} characters "
                "from the PDF."
            )

            # The LLM receives the actual extracted source text.
            return self.generate_report(
                extracted_text=extracted_text,
                report_id=report_id,
            )


# --------------------------------------------------
# 6. Standalone testing: no hardcoded PDF filename
# --------------------------------------------------

def main():
    pdf_files = list(DOCUMENTS_DIR.glob("*.pdf"))

    if not pdf_files:
        raise FileNotFoundError(
            f"No PDF files found in {DOCUMENTS_DIR}"
        )

    # Pick the latest PDF only for standalone testing.
    pdf_path = max(
        pdf_files,
        key=lambda path: path.stat().st_mtime,
    )

    print(f"Testing PDF: {pdf_path.name}")

    researcher = LocalFileResearcher()

    result, report_path = researcher.kickoff(
        file_path=pdf_path.name,
        report_id=str(uuid.uuid4()),
    )

    print("\n========== FINAL REPORT ==========\n")
    print(result)
    print(f"\nReport saved to: {report_path}")


if __name__ == "__main__":
    main()

