from vector_db.chroma_client import collection
from rag.embeddings import embed_text

def process_document(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = [text[i:i+500] for i in range(0, len(text), 500)]

    embeddings = embed_text(chunks)

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"{file_path}_{i}" for i in range(len(chunks))]
    )