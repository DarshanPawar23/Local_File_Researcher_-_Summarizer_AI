
from fastapi import APIRouter, File, UploadFile

from controllers.file_controller import research_pdf

router = APIRouter(
    prefix="/api/files",
    tags=["File Research"],
)


@router.post("/research")
async def research_uploaded_pdf(
    file: UploadFile = File(...),
):
    return await research_pdf(file)
