# Knowledge Builder - Client

The client is the React web app for chatting with the knowledge base and uploading PDF documents.

## Tech stack

- React 19 and TypeScript
- Vite 8 for local development and production builds
- Axios for requests to the FastAPI server
- `react-markdown` and `remark-gfm` for assistant responses
- `lucide-react` for icons

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- The Knowledge Builder API running locally or at a configured URL

## Run locally

From this directory:

```bash
npm install
npm run dev
```

Open the URL Vite prints (by default, <http://localhost:5173>).

Start the backend separately; see the [server README](../server/README.md). The client expects it at `http://127.0.0.1:8000` by default.

To use a different API URL, create `.env.local` in this directory:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Vite environment variables are embedded into the client bundle. Do not put secrets in `VITE_*` variables.

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create the production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## App behavior

- Sends chat questions to `POST /chat`.
- Sends selected PDF files to `POST /ingest` as multipart form data.
- Displays assistant answers as Markdown and shows retrieved source excerpts.
- The API base URL comes from `VITE_API_URL`, falling back to `http://127.0.0.1:8000`.

The client only validates PDF selection in the UI. The API must independently validate uploads before accepting them in a production deployment.
