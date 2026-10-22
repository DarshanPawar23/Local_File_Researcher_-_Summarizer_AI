
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.file_routes import router as file_router

app = FastAPI(
    title="Local File Researcher & Summarizer AI",
    description="Upload PDFs and generate AI research reports.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(file_router)


@app.get("/")
async def root():
    return {
        "message": "Local File Researcher & Summarizer AI API is running"
    }
