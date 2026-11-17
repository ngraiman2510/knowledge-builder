import os

import anyio
from app.db.db import create_sqlite_instance
from app.models.models import IngestionResponse
from app.rag.ingestion import create_rag_with_file
from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()
DATA_DIR = os.path.join(os.path.dirname(__file__), "../../data")
os.makedirs(DATA_DIR, exist_ok=True)
FILES_UPLOAD = File(default=[])


@router.post("/ingest", response_model=IngestionResponse)
async def ingest_data(
    files: list[UploadFile] = FILES_UPLOAD,
) -> IngestionResponse:
    if len(files) == 0:
        return IngestionResponse(
            status="success", message="No files uploaded.", total_chunks=0
        )
    else:
        try:
            total_chunks_indexed = 0
            vector_store = create_sqlite_instance()
            for file in files:
                if not file.filename:
                    raise HTTPException(
                        status_code=400, detail="Uploaded file is missing a filename."
                    )

                filename = os.path.basename(file.filename.replace("\\", "/"))
                if filename in {"", ".", ".."} or "\x00" in filename:
                    raise HTTPException(
                        status_code=400, detail="Uploaded file has an invalid filename."
                    )

                file_path = os.path.join(DATA_DIR, filename)
                async with await anyio.open_file(file_path, "wb") as f:
                    await f.write(await file.read())

                chunks_count = create_rag_with_file(file_path, vector_store)
                total_chunks_indexed += chunks_count
            return IngestionResponse(
                status="success",
                message=f"Successfully ingested {len(files)} file(s).",
                total_chunks=total_chunks_indexed,
            )
        except (OSError, ValueError) as e:
            raise HTTPException(status_code=500, detail=str(e))
