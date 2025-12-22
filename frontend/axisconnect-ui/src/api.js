const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://nemo-backend-oh6i.onrender.com";

/**
 * Upload document (PDF / TXT / DOCX)
 * @param {File} file
 */
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Document upload failed");
  }

  return response.json();
}

/**
 * Chat with RAG backend
 * @param {string} message
 * @param {string} role
 * @param {Array} history
 */
export async function chat(message, role = "user", history = []) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      role,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  return response.json();
}
