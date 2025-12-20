import os
import logging
from dotenv import load_dotenv

from pinecone import Pinecone

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_groq import ChatGroq

from document_loader import load_documents_from_path, chunk_documents

# --------------------------------------------------
# Setup
# --------------------------------------------------
load_dotenv()
logging.basicConfig(level=logging.INFO)

_llm = None
_embeddings = None
_vector_store = None

# --------------------------------------------------
# Config
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCUMENT_PATH = os.path.join(BASE_DIR, "data")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# --------------------------------------------------
# LLM
# --------------------------------------------------
def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatGroq(model="llama-3.1-8b-instant")
        logging.info("✅ Groq LLM initialized")
    return _llm

# --------------------------------------------------
# Embeddings
# --------------------------------------------------
def get_embeddings():
    global _embeddings
    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        logging.info("✅ Embeddings initialized")
    return _embeddings

# --------------------------------------------------
# Vector Store (Pinecone Serverless)
# --------------------------------------------------
def get_vector_store():
    global _vector_store

    if _vector_store is not None:
        return _vector_store

    if not PINECONE_API_KEY or not PINECONE_INDEX_NAME:
        raise ValueError("❌ Pinecone API key or index name missing")

    logging.info("🌲 Initializing Pinecone (serverless)")

    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX_NAME)

    documents = load_documents_from_path(DOCUMENT_PATH)
    splits = chunk_documents(documents)

    if not splits:
        raise ValueError("❌ No documents to ingest")

    embeddings = get_embeddings()

    _vector_store = PineconeVectorStore(
        index=index,
        embedding=embeddings,
        text_key="text",
        namespace="current"
    )

    _vector_store.add_documents(splits)

    logging.info(f"✅ Ingested {len(splits)} chunks into Pinecone")
    return _vector_store

# --------------------------------------------------
# Reset
# --------------------------------------------------
def reset_vector_store():
    global _vector_store
    _vector_store = None
    logging.info("♻️ Vector store reset (no Pinecone delete)")



