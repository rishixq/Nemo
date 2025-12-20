import os
from typing import List

from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter


SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".docx"}


def load_documents_from_path(path: str) -> List[Document]:
    """
    Load documents from a file or directory.
    Supports PDF, TXT, and DOCX formats.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Path not found: {path}")

    documents: List[Document] = []

    if os.path.isfile(path):
        documents.extend(_load_single_file(path))
    else:
        for root, _, files in os.walk(path):
            for file in files:
                full_path = os.path.join(root, file)
                documents.extend(_load_single_file(full_path))

    return documents


def _load_single_file(file_path: str) -> List[Document]:
    ext = os.path.splitext(file_path)[1].lower()

    if ext not in SUPPORTED_EXTENSIONS:
        return []

    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
    elif ext == ".docx":
        loader = Docx2txtLoader(file_path)
    elif ext == ".txt":
        loader = TextLoader(file_path, encoding="utf-8")
    else:
        return []

    return loader.load()


def chunk_documents(
    documents: List[Document],
    chunk_size: int = 500,
    chunk_overlap: int = 50
) -> List[Document]:
    """
    Split documents into smaller chunks for embedding.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return splitter.split_documents(documents)
