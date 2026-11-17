from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_community.vectorstores import SQLiteVec
from langchain_text_splitters import RecursiveCharacterTextSplitter


def text_splitter():
    return RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)


def create_rag_with_url(url: str, vector_store: SQLiteVec):
    loader = WebBaseLoader(
        web_paths=(url,),
        header_template={"User-Agent": "KnowledgeBuilder/1.0"},
        raise_for_status=True,
        requests_kwargs={"timeout": 30},
    )
    documents = [document for document in loader.load() if document.page_content.strip()]
    if not documents:
        raise ValueError(f"No readable text was found at {url}")

    splitter = text_splitter()
    chunks = splitter.split_documents(documents)

    vector_store.add_documents(chunks)
    return len(chunks)


def create_rag_with_file(file_path: str, vector_store: SQLiteVec) -> int:
    uploader = PyPDFLoader(file_path)
    document = uploader.load()
    splitter = text_splitter()
    chunks = splitter.split_documents(document)

    vector_store.add_documents(chunks)
    return len(chunks)


def retrieve_from_rag(store: SQLiteVec, query: str, k: int = 4):
    retriever = store.as_retriever(search_kwargs={"k": k})
    return retriever.invoke(query)
