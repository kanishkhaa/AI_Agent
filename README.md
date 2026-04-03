# AI-Powered Knowledge Assistant (RAG + MCP)

## Project Structure

```
ai-knowledge-assistant/
│
├── app/                        # Main application (FastAPI)
│   ├── main.py                 # Entry point
│   ├── config.py               # Environment variables & settings
│   ├── routes/                 # API routes
│   │   ├── upload.py           # File upload endpoint
│   │   ├── query.py            # Query/ask endpoint
│
├── rag/                        # RAG pipeline (Retrieval-Augmented Generation)
│   ├── ingest.py               # Document processing (chunking + embedding)
│   ├── retriever.py            # Vector search logic
│   ├── embeddings.py           # Embedding generation
│
├── llm/                        # LLM integrations
│   ├── groq_client.py          # Groq API (fast responses)
│   ├── gemini_client.py        # Google AI Studio API (deep reasoning)
│   ├── router.py               # LLM selection logic
│
├── agent/                      # AI decision-making layer
│   ├── agent.py                # Main agent logic
│   ├── router.py               # Query routing (RAG vs MCP)
│   ├── memory.py               # Chat memory (optional)
│
├── mcp_server/                 # MCP Server (tool provider)
│   ├── tools/                  # Individual tools
│   │   ├── weather.py
│   │   ├── calculator.py
│   │   ├── wiki.py
│   │
│   ├── server.py               # MCP server setup
│
├── mcp_client/                 # MCP Client (tool caller)
│   ├── client.py
│
├── vector_db/                  # Vector database setup
│   ├── chroma_client.py
│
├── storage/                    # Uploaded files
│   ├── uploads/                # User-uploaded documents
│
├── utils/                      # Utility/helper functions
│   ├── text_splitter.py
│   ├── prompt_templates.py
│
├── tests/                      # Test cases
│   ├── test_agent.py
│
├── .env                        # API keys (not committed)
├── requirements.txt            # Dependencies
├── README.md                   # Project documentation
```

---

## 📌 Notes

* **storage/uploads/** → Stores user-uploaded files dynamically
* **rag/** → Handles document ingestion and retrieval
* **llm/** → Manages multiple LLM providers (Groq + Gemini)
* **agent/** → Decides whether to use RAG or MCP tools
* **mcp_server/** → Defines tools (APIs, utilities)
* **mcp_client/** → Calls MCP tools from agent
* **vector_db/** → Handles embedding storage (ChromaDB)
