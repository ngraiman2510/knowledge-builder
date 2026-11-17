# Knowledge Builder - Server

The server provides the FastAPI endpoints and retrieval-augmented generation (RAG) pipeline used by the client.

## Tech stack

- Python and FastAPI, served by Uvicorn
- LangChain for document loading, chunking, retrieval, and LLM orchestration
- OpenAI embeddings and `gpt-4o-mini` for vector search and answers
- SQLiteVec with a local SQLite database for document embeddings
- `PyPDFLoader` for PDFs and `WebBaseLoader` (Beautiful Soup) for the default web source

## Requirements

- Python 3.10 or newer
- An OpenAI API key with access to embeddings and chat completions
- Internet access on first startup to index the default web source

## Setup and run

From this directory, create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

On Windows PowerShell, activate it with:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies and configure the environment:

```bash
python -m pip install -r requirements.txt
cp .env.example .env
```

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set `OPENAI_API_KEY` to your own key. Do not commit `.env` or share its contents.

Start the API from this directory so `server/.env` is loaded:

```bash
python -m uvicorn app.main:app --reload
```

The API is available at <http://127.0.0.1:8000>. Interactive API documentation is at <http://127.0.0.1:8000/docs>.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Used for embeddings and chat completions. |
| `DEFAULT_RAG_URL` | Yes | Web page indexed into the knowledge base if it has not already been indexed. Defaults to the Tamil Nadu schemes page in `.env.example`. |
| `CLIENT_URL` | No | Allowed browser origin for CORS. Defaults to `http://localhost:5173`. |

## Data and startup behavior

- The SQLite vector database is created at `server/data/knowledge_base.db`.
- Uploaded PDFs are written under `server/app/data/`.
- On startup, the server indexes `DEFAULT_RAG_URL` if the database does not already contain chunks from that URL. This first indexing run calls the OpenAI embeddings API and can take time.
- Deleting the SQLite database causes the default source to be indexed again on the next startup.
- Retrieved chunks are used to answer questions and are returned as sources by the chat endpoint.

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Basic service message. |
| `POST` | `/ingest` | Accepts PDF files in the multipart `files` field and indexes their content. |
| `POST` | `/chat` | Accepts a JSON body such as `{"question":"..."}` and returns an answer with sources. |

For local development, run the [client](../client/README.md) in a second terminal. The client uses `http://127.0.0.1:8000` as its default API URL.

## Dependency updates

`requirements.txt` lists the server's direct dependencies. After changing it, reinstall with:

```bash
python -m pip install -r requirements.txt
```
