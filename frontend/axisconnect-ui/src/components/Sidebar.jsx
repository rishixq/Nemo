import { useRef } from "react";
import { uploadDocument } from "../api";

const ROLE_BADGE = {
  admin:   "bg-blue-950 text-white",      // authority, executive
  doctor:  "bg-emerald-600 text-white",    // trust, health
  student: "bg-amber-400 text-black",      // learning, energy
  user:    "bg-violet-600 text-white",     // friendly, general
};


const Sidebar = ({ role, setRole, uploadedDocs, onUploadSuccess }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadDocument(file);
      onUploadSuccess(file.name); // ✅ key line
      alert("✅ Document uploaded successfully");
    } catch {
      alert("❌ Failed to upload document");
    } finally {
      e.target.value = null;
    }
  };

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-[#0f3d3e] to-[#062928]
 text-white flex flex-col px-6 py-5">
 {/* Header */}
<div className="mb-6 flex items-center gap-3">
  <img
    src="https://i.pinimg.com/736x/73/e3/67/73e3671ef0ba7224d51090df8fcbab7c.jpg"
    alt="Nemo Logo"
    className="w-10 h-10 rounded-md"
  />

  <div>
    <h1 className="text-xl font-bold mt-3leading-tight">Nemo</h1>
    <p className="text-xs text-gray-400">Role Aware Chatbot</p>
  </div>
</div>


      {/* Role Badge */}
      <div className="mb-4">
        <p className="text-xs text-gray-300 mb-1">Active Role</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE[role]}`}
        >
          {role.toUpperCase()}
        </span>
      </div>

      {/* Role Selector */}
      <div className="mb-6">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-[#0b2e2d] border border-[#134e4a] rounded-lg px-4 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="user">User</option>
          <option value="student">Student</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          ▾
        </span>

      </div>

      {/* Upload */}
      <div className="mb-6">
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-full bg-[#1f6f6b]/70 border border-[#2fa29b]/40 hover:bg-black transition rounded-lg px-3 py-2 text-sm text-white"

        >
          📁Upload File (.pdf / .docx / .txt)
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Uploaded Docs */}
      <div className="flex-1">
        <p className="text-xs text-gray-300 mb-2">Active Documents</p>
        {uploadedDocs.length === 0 ? (
          <p className="text-xs text-gray-500 ">No documents uploaded</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {uploadedDocs.map((doc, i) => (
              <li
                key={i}
                className="bg-white/10 border border-white/15 rounded-md px-2 py-1 truncate text-white backdrop-blur-sm"

              >
                📄 {doc}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
