import asyncio
import os
from contextlib import asynccontextmanager

from app.api.endpoints import chat, ingest
from app.db.db import create_sqlite_instance
from app.rag.ingestion import create_rag_with_url
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load variables from server/.env into os.environ
load_dotenv()

# Verify it loaded correctly (Optional debugging check)
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is missing from environment variables!")

DEFAULT_RAG_URL = os.getenv("DEFAULT_RAG_URL")
if not DEFAULT_RAG_URL:
    raise ValueError("DEFAULT_RAG_URL is missing from environment variables!")


def prebuild_default_rag():
    vectorstore = create_sqlite_instance()
    already_indexed = vectorstore._connection.execute(
        """
        SELECT 1
        FROM knowledge_base
        WHERE json_extract(CAST(metadata AS TEXT), '$.source') = ?
        LIMIT 1
        """,
        (DEFAULT_RAG_URL,),
    ).fetchone()
    if already_indexed:
        print("Default RAG source is already indexed; skipping.")
        return

    print("Indexing default RAG knowledge base...")
    assert DEFAULT_RAG_URL is not None, "DEFAULT_RAG_URL must be set in environment variables."
    chunks_count = create_rag_with_url(DEFAULT_RAG_URL, vectorstore)
    print(
        f"Default RAG pre-built successfully! Indexed {chunks_count} chunks from URL."
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    await asyncio.to_thread(prebuild_default_rag)
    yield


app = FastAPI(title="Knowledge Builder", lifespan=lifespan)

# Enable CORS for the React + Vite frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL") or "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(chat.router)


@app.get("/")
def read_root():
    return "Create a knowledge base by uploading files and then ask questions to get answers from the knowledge base."
