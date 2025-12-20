import ReactMarkdown from "react-markdown";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("✅ Answer copied to clipboard");
}

function openSource(source) {
  if (!source) return;
  window.open(`${API_BASE_URL}/data/${encodeURIComponent(source)}`, "_blank");
}



function ChatBubble({ role, content, source, isLastUserMessage, onEdit }) {

  const isUser = role === "user";

  return (
    <div
    className="group"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        alignItems: "flex-start",
      }}
    >
      {!isUser && (
        <div style={{ marginRight: "6px", fontSize: "18px", marginTop: "18px" }}>
          🤖
        </div>
      )}

      <div style={{ maxWidth: "70%" }}>
        {!isUser && source && (
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              marginBottom: "4px",
              paddingLeft: "16px",
            }}
          >
              Nemo 
              
            </div>
          )}

        <div
          style={{
            minWidth: isUser ? "60px" : "auto",
            background: isUser ? "#000" : "#ffffff",
            color: isUser ? "#fff" : "#111827",

            padding: "14px 16px",
            borderRadius: isUser
              ? "14px 14px 4px 14px"
              : "14px 14px 14px 4px",
            border: !isUser ? "1px solid #e5e7eb" : "none",

            /* ✅ SAFE TEXT HANDLING */
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",

            wordBreak: "break-word",

            fontSize: isUser ? "13px" : "14px",
            lineHeight: "1.25",

          }}
        >
          <ReactMarkdown
  components={{
    p: ({ children }) => (
      <p style={{ margin: "0 0 6px 0" }}>
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong style={{ fontWeight: 600 }}>
        {children}
      </strong>
    ),
    h1: ({ children }) => (
      <div style={{ fontWeight: 600, marginBottom: "6px" }}>
        {children}
      </div>
    ),
    h2: ({ children }) => (
      <div style={{ fontWeight: 600, marginBottom: "6px" }}>
        {children}
      </div>
    ),
    ul: ({ children }) => (
      <ul style={{ margin: "4px 0", paddingLeft: "18px" }}>
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: "4px" }}>
        {children}
      </li>
    ),
  }}
>
  {content}
</ReactMarkdown>
          



        </div>
        {((!isUser) || (isUser && isLastUserMessage)) && (

            <div
            className="text-gray-500"

              style={{
                display: "flex",
                gap: "12px",
                marginTop: "8px",
                fontSize: "11px",
                
                cursor: "pointer",
                paddingLeft: "16px"
                
              }}
          >
            <span className="hover:text-gray-900 transition-colors" onClick={() => copyToClipboard(content)}>
              📋Copy
            </span>
            {source && (
              <span className="hover:text-gray-900 transition-colors" onClick={() => openSource(source)}>
              🔗 Open source
              </span>
            )}
            {isUser && isLastUserMessage && (
              <span className="hover:text-gray-900 transition-colors" onClick={onEdit}>
                ✏️ Edit
              </span>
      )}

            </div>
        )}
        

      </div>
    </div>
  );
}

export default ChatBubble;


