import os
import app_state

from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from app_state import get_llm, get_vector_store
from prompts import ROLE_SYSTEM_PROMPTS


class Assistant:
    def __init__(self, role="user", message_history=None):
        self.role = role if role in ROLE_SYSTEM_PROMPTS else "user"
        self.system_prompt = ROLE_SYSTEM_PROMPTS[self.role]

        self.llm = get_llm()
        self.vector_store = None
        self.messages = message_history or []
        self.last_source = None

    # --------------------------------------------------
    # SAFE DOCUMENT CONTEXT (RAG)
    # --------------------------------------------------
    def _policy_context(self, query: str) -> str:
    # No document uploaded → general chat
        if app_state.CURRENT_NAMESPACE is None:
            self.last_source = None
            return ""

        if self.vector_store is None:
            try:
                self.vector_store = get_vector_store(
                    namespace=app_state.CURRENT_NAMESPACE
                )
            except Exception:
                self.last_source = None
                return ""

        try:
            docs = self.vector_store.similarity_search(query, k=3)
        except Exception:
            self.last_source = None
            return ""

        if not docs:
            self.last_source = None
            return ""

    # Capture source file
        if "source" in docs[0].metadata:
            self.last_source = os.path.basename(docs[0].metadata["source"])
        else:
            self.last_source = None

        MAX_POLICY_CHARS = 1200
        return "\n".join(d.page_content for d in docs)[:MAX_POLICY_CHARS]


    # --------------------------------------------------
    # BUILD CHAIN
    # --------------------------------------------------
    def build_chain(self):
        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                self.system_prompt
                + "\n\nDocument Context:\n{policy_context}\n"
            ),
            MessagesPlaceholder("conversation_history"),
            ("human", "{user_input}")
        ])

        MAX_HISTORY = 4
        history = [
            HumanMessage(content=m.content) if m.role == "user"
            else AIMessage(content=m.content)
            for m in self.messages[-MAX_HISTORY:]
        ]

        chain = (
            {
                "policy_context": lambda q: self._policy_context(q),
                "conversation_history": lambda _: history,
                "user_input": RunnablePassthrough(),
            }
            | prompt
            | self.llm
            | StrOutputParser()
        )

        return chain

    # --------------------------------------------------
    # MAIN ENTRY
    # --------------------------------------------------
    def get_response(self, user_input: str) -> str:
        try:
            chain = self.build_chain()
            response = chain.invoke(user_input)
        except Exception:
            response = (
                "I’m currently unable to retrieve relevant information from the documents. "
                "Please try rephrasing your question."
            )

        self.messages.append(
            type("Msg", (), {"role": "user", "content": user_input})
        )
        self.messages.append(
            type("Msg", (), {"role": "ai", "content": response})
        )

        return response
