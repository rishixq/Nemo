# 🤖 **NEMO — A Role-Aware RAG Chatbot**

**Groq · LangChain · Pinecone Serverless · FastAPI · React**

**NEMO** is a **production-style, role-aware Retrieval-Augmented Generation (RAG) chatbot** that can intelligently answer **both document-based questions and general questions**, adapting its tone and depth based on the selected user role — all through a modern ChatGPT-style interface.

Built with **clean architecture**, **deployment-ready practices**, and **real-world RAG patterns**.

---

## 🎥 Demo Video

▶️ **Watch the full working demo:**
👉 *[(Add your YouTube / Drive demo link here](https://youtu.be/nt1SNgoQHEM))*

---

## ✨ Key Capabilities

### 🧠 Intelligent Chat

* Answers **general questions** naturally (no documents required)
* Automatically switches to **RAG mode** when a document-based query is detected
* Maintains **short-term conversational memory**

### 📄 Document-Based Q&A (RAG)

* Upload **PDF / DOCX / TXT**
* Retrieves relevant chunks using **vector similarity search**
* Generates **grounded answers**
* Displays **clickable source documents**

### 🎭 Role-Aware Responses

Responses adapt based on selected role:

* **Admin** → executive, concise, formal
* **Doctor** → precise, professional, factual
* **Student** → explanatory, beginner-friendly
* **User** → casual, conversational

### ⚡ Production-Ready Design

* Pinecone **Serverless** (no infra management)
* No hard deletes (stability-focused)
* Namespace-based ingestion
* Environment-based configuration
* Clean backend–frontend separation

---

## 🧠 How NEMO Works (End-to-End)

1. User selects a **role**
2. User uploads a document *(optional)*
3. Document is:

   * Loaded
   * Chunked
   * Embedded
   * Stored in Pinecone Serverless
4. User sends a message
5. System decides:

   * **General Chat** → LLM only
   * **Document Question** → RAG pipeline
6. Response is generated with:

   * Role-specific prompt
   * Optional retrieved context
   * Source reference (if document-based)

This mirrors **real-world AI assistants**, not demo-only bots.

---

## 🧱 Tech Stack

### Backend

* Python
* FastAPI
* Uvicorn

### LLM

* Groq
* Model: `llama-3.1-8b-instant`

### LLM Framework

* LangChain

### Vector Database

* Pinecone (Serverless)

### Embeddings

* Hugging Face
  `sentence-transformers/all-MiniLM-L6-v2`

### Frontend

* React
* Tailwind CSS
* Custom ChatGPT-style UI (no component libraries)

---

## 📁 Project Structure

```
Bot/
│
├── main.py                # FastAPI app & API routes
├── app_state.py           # LLM, embeddings & Pinecone lifecycle
├── assistant.py           # Core RAG + chat logic
├── prompts.py             # Role-aware system prompts
├── roles.py               # Role normalization & mapping
├── document_loader.py     # Document loading & chunking
│
├── data/
│   └── .gitkeep           # Keeps upload directory tracked
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   └── components/
│   │       ├── Sidebar.jsx
│   │       └── ChatBubble.jsx
│   └── build/             # Production build (optional)
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## 🧠 What NEMO Demonstrates

* Real-world **RAG architecture**
* Hybrid **general chat + document QA**
* Prompt engineering with role control
* Vector search best practices
* Full-stack AI system design
* Deployment awareness

---

## 👤 Author

Built by **Rishi Kishore**
GitHub: [https://github.com/rishixq](https://github.com/rishixq)

