from vector_db.chroma_client import collection
from rag.embeddings import embed_text

def retrieve(query):
    query_embedding = embed_text([query])

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )

    return results["documents"]