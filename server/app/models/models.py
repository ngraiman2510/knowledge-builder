from typing import Any

from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class SourceChunk(BaseModel):
    content: str
    metadata: dict[str, Any]


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]


class IngestionResponse(BaseModel):
    status: str
    message: str
    total_chunks: int
