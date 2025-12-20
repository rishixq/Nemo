import { useState, useRef, useEffect } from "react";


import ChatBubble from "./components/ChatBubble";
import Sidebar from "./components/Sidebar";
import { chat } from "./api";

function App() {
  const [role, setRole] = useState("user");
  const [uploadedDocs, setUploadedDocs] = useState([]); // ✅

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "👋 Welcome! Select a role and upload documents to start chatting.",
    },
  ]);

  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const prevRoleRef = useRef(role);


  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const [autoScroll, setAutoScroll] = useState(true);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setEditingIndex(null);


    const newHistory = [...chatHistory, userMsg];

    try {
      setIsTyping(true);
      const data = await chat(userMsg.content, role, newHistory);

      const aiMsg = { role: "ai", content: data.reply, source: data.source, }; // ✅
      setMessages((prev) => [...prev, aiMsg]);
      setChatHistory([...newHistory, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Unable to retrieve document information." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleEdit = (index) => {
  const msg = messages[index];
  if (!msg || msg.role !== "user") return;

  setInput(msg.content);

  // Remove everything after the edited message
  const trimmedMessages = messages.slice(0, index);
  setMessages(trimmedMessages);
  setChatHistory(trimmedMessages);

  setEditingIndex(index);
  };

  const handleScroll = () => {
  const el = chatContainerRef.current;
  if (!el) return;

  const isAtBottom =
    el.scrollHeight - el.scrollTop - el.clientHeight < 50;

  setAutoScroll(isAtBottom);
  };
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, autoScroll]);

  useEffect(() => {
  if (messages.length > 1 && prevRoleRef.current !== role) {
    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: "⚠️ Role changed. Responses may differ.",
      },
    ]);
  }

  prevRoleRef.current = role;
  }, [role]);



  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        role={role}
        setRole={setRole}
        uploadedDocs={uploadedDocs}                 // ✅
        onUploadSuccess={(filename) =>
          setUploadedDocs((prev) => [...prev, filename]) // ✅
        }
      />

      <main className="flex-1 flex flex-col bg-[#eef6f5]">

        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => {
            const isLastUserMessage =
              m.role === "user" &&
              i === messages.map(msg => msg.role).lastIndexOf("user");
              if (m.role === "system") {
                return (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      fontSize: "11px",
                      color: "#6b7280",
                      margin: "8px 0",
                    }}
                  > 
                    {m.content}
                  </div>
                );
             }
            
            return (
              <ChatBubble
                key={i}
                role={m.role}
                content={m.content}
                source={m.source}
                isLastUserMessage={isLastUserMessage}
                onEdit={() => handleEdit(i)}
              />
            );
          })}
          {isTyping && (
            <div className="text-sm text-gray-500 italic">
              🤖 Nemo is typing…
            </div>
          )}
          <div ref={bottomRef} />

        </div>

        <div className="border-t border-gray-200 bg-[#f6fafa] p-4 flex gap-3 rounded-t-2xl
">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#1f6f6b]/40"
            placeholder="Ask anything..."
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-[#1f6f6b] to-[#2fa29b] text-white rounded-full px-6 py-3 shadow-[0_4px_12px_rgba(31,111,107,0.35)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1f6f6b]/40 transition"


          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
