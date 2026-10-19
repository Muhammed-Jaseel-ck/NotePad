import { useState } from "react";
import { NotesProvider, useNotes } from "./context/NotesContext";
import { Toaster } from "react-hot-toast";

function NotesUI() {
  const { notes, loading, error, createNote, updateNote, deleteNote, toggleArchive, searchNotes } = useNotes();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = search ? searchNotes(search) : notes;

  const handleAdd = () => {
    if (editing) {
      updateNote(editing.id, { title, content: text });
      setEditing(null);
    } else {
      createNote({ title, content: text });
    }
    setTitle("");
    setText("");
  };

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" />
      
      {/* Loading Spinner during API calls */}
      {loading && <div className="fixed top-0 left-0 w-full h-1 bg-yellow-400 animate-pulse" />}

      <h1 className="text-2xl font-bold text-center mb-4">Notes App</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full max-w-md mx-auto block border p-2 rounded mb-4"
      />

      <div className="bg-white max-w-md mx-auto p-3 rounded shadow mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full p-2 outline-none font-bold"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Take a note..."
          className="w-full p-2 outline-none"
        />
        <div className="flex gap-2 mt-2">
          <button onClick={handleAdd} className="bg-yellow-400 px-4 py-1 rounded">
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setTitle(""); setText(""); }} className="bg-gray-200 px-4 py-1 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {loading && notes.length === 0 ? (
        <div className="flex justify-center mt-20">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {filtered.map((n) => (
            <div key={n.id} className={`p-3 rounded shadow ${n.archived ? "bg-gray-300" : "bg-white"}`}>
              <h3 className="font-bold">{n.title}</h3>
              <p className="text-sm mt-1">{n.content}</p>
              <p className="text-[10px] text-gray-400 mt-2">{n.tags?.join(", ")} {n.archived ? "• Archived" : ""}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => { setEditing(n); setTitle(n.title); setText(n.content); }} className="text-blue-500 text-xs">Edit</button>
                <button onClick={() => toggleArchive(n.id)} className="text-yellow-600 text-xs">{n.archived ? "Unarchive" : "Archive"}</button>
                <button onClick={() => deleteNote(n.id)} className="text-red-500 text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && <p className="text-center text-gray-400 mt-10">No notes</p>}
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <NotesUI />
    </NotesProvider>
  );
}