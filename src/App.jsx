import { useState } from "react";
import { NotesProvider, useNotes } from "./context/NotesContext";
import { Toaster } from "react-hot-toast";

const NOTE_COLORS = ["yellow", "green", "blue", "purple", "pink", "orange"];
const NOTE_COLOR_CLASSES = {
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  blue: "bg-blue-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
  orange: "bg-orange-100",
};
const NOTE_COLOR_SWATCH_CLASSES = {
  yellow: "bg-yellow-400",
  green: "bg-green-400",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
  pink: "bg-pink-400",
  orange: "bg-orange-400",
};

function NotesUI() {
  const { notes, loading, error, createNote, updateNote, deleteNote, toggleArchive, searchNotes } = useNotes();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState("yellow");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [colorFilter, setColorFilter] = useState("all");
  const [showColorFilter, setShowColorFilter] = useState(false);

  const filtered = (search ? searchNotes(search) : notes).filter(
    (note) => Boolean(note.archived) === showArchived
  ).filter((note) => colorFilter === "all" || (note.color || "yellow") === colorFilter);
  const handleAdd = () => {
    if (editing) {
      updateNote(editing.id, { title, content: text, color });
      setEditing(null);
    } else {
      createNote({ title, content: text, color });
    }
    setTitle("");
    setText("");
    setColor("yellow");
  };

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" />
      
      {/* Loading Spinner during API calls */}
      {loading && <div className="fixed top-0 left-0 w-full h-1 bg-yellow-400 animate-pulse" />}

      <h1 className="text-2xl font-bold text-center mb-4">Notes App</h1>

      <div className="relative flex w-full max-w-md mx-auto gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="min-w-0 flex-1 border p-2 rounded"
        />
        <button
          type="button"
          onClick={() => setShowColorFilter((open) => !open)}
          aria-label="Filter notes by color"
          aria-expanded={showColorFilter}
          className={`relative border rounded px-3 hover:bg-gray-50 ${colorFilter !== "all" ? "border-gray-500" : ""}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5z" />
          </svg>
          {colorFilter !== "all" && (
            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${NOTE_COLOR_SWATCH_CLASSES[colorFilter]}`} />
          )}
        </button>
        {showColorFilter && (
          <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded border bg-white p-2 shadow-lg">
            <p className="px-2 pb-1 text-xs font-semibold text-gray-500">Filter by color</p>
            <button
              type="button"
              onClick={() => { setColorFilter("all"); setShowColorFilter(false); }}
              aria-pressed={colorFilter === "all"}
              className={`w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 ${colorFilter === "all" ? "bg-gray-100 font-semibold" : ""}`}
            >
              All colors
            </button>
            {NOTE_COLORS.map((noteColor) => (
              <button
                key={noteColor}
                type="button"
                onClick={() => { setColorFilter(noteColor); setShowColorFilter(false); }}
                aria-pressed={colorFilter === noteColor}
                className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 ${colorFilter === noteColor ? "bg-gray-100 font-semibold" : ""}`}
              >
                <span className={`h-3 w-3 rounded-full ${NOTE_COLOR_SWATCH_CLASSES[noteColor]}`} />
                {noteColor.charAt(0).toUpperCase() + noteColor.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setShowArchived(false)}
          className={`px-4 py-1 rounded ${!showArchived ? "bg-yellow-400" : "bg-white"}`}
        >
          Notes
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-4 py-1 rounded ${showArchived ? "bg-yellow-400" : "bg-white"}`}
        >
          Archived
        </button>
      </div>

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
        <label className="flex items-center gap-2 text-sm">
          <span>Color</span>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border p-1 rounded bg-white"
          >
            {NOTE_COLORS.map((noteColor) => (
              <option key={noteColor} value={noteColor}>
                {noteColor.charAt(0).toUpperCase() + noteColor.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 mt-2">
          <button onClick={handleAdd} className="bg-yellow-400 px-4 py-1 rounded">
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setTitle(""); setText(""); setColor("yellow"); }} className="bg-gray-200 px-4 py-1 rounded">
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
            <div key={n.id} className={`p-3 rounded shadow ${n.archived ? "bg-gray-300" : NOTE_COLOR_CLASSES[n.color] || NOTE_COLOR_CLASSES.yellow}`}>
              <h3 className="font-bold">{n.title}</h3>
              <p className="text-sm mt-1">{n.content}</p>
              <p className="text-[10px] text-gray-500 mt-2">{n.tags?.join(", ")} {n.archived ? "• Archived" : ""}</p>
              <div className="flex gap-3 mt-2">
              <button onClick={() => { setEditing(n); setTitle(n.title); setText(n.content); setColor(n.color || "yellow"); }} className="text-blue-500 text-xs">Edit</button>
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