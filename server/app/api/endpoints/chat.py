from app.db.db import create_sqlite_instance
from app.models.models import ChatRequest, ChatResponse, SourceChunk
from app.rag.ingestion import retrieve_from_rag
from fastapi import APIRouter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_knowledge_base(request: ChatRequest) -> ChatResponse:
    question = request.question
    store = create_sqlite_instance()
    rag_results = retrieve_from_rag(store, question)
    if not rag_results:
        return ChatResponse(
            answer="I couldn't find any relevant documents in the knowledge base for that question.",
            sources=[],
        )

    context = "\n".join([result.page_content for result in rag_results])
    prompt_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                (
                    "You are a helpful assistant that provides information based on the provided context. If the context does not contain the answer, respond with 'I don't know.'"
                    "Your answer should be structured in a way that is easy to read and understand like showing in table format, bullet points, charts, etc. If the context contains multiple sources, please cite them appropriately."
                    "Context:\n{context}"
                ),
            ),
            ("user", "Question: {question}"),
        ]
    )

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    chain = prompt_template | llm | StrOutputParser()
    answer = chain.invoke({"context": context, "question": question})

    return ChatResponse(
        answer=answer,
        sources=[
            SourceChunk(content=result.page_content, metadata=result.metadata)
            for result in rag_results
        ],
    )
