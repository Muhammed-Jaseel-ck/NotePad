import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const NotesContext = createContext();
const API_URL = "http://localhost:3001/notes";

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetchNotes()
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // createNote(note)
  const createNote = async (noteData) => {
    if (!noteData.title && !noteData.content) return;
    setLoading(true);
    try {
      const newNote = {
        title: noteData.title,
        content: noteData.content,
        color: "yellow",
        tags: ["work"],
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const res = await axios.post(API_URL, newNote);
      setNotes((prev) => [res.data, ...prev]);
      toast.success("Note created");
    } catch {
      toast.error("Create failed");
    } finally {
      setLoading(false);
    }
  };

  // updateNote(id, updates)
  const updateNote = async (id, updates) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${API_URL}/${id}`, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      setNotes((prev) => prev.map((n) => (n.id == id ? res.data : n)));
      toast.success("Note updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // deleteNote(id)
  const deleteNote = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes((prev) => prev.filter((n) => n.id != id));
      toast.success("Note deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // toggleArchive(id)
  const toggleArchive = async (id) => {
    const note = notes.find((n) => n.id == id);
    if (!note) return;
    setLoading(true);
    try {
      const res = await axios.patch(`${API_URL}/${id}`, {
        archived: !note.archived,
      });
      setNotes((prev) => prev.map((n) => (n.id == id ? res.data : n)));
      toast.success(res.data.archived ? "Archived" : "Unarchived");
    } catch {
      toast.error("Archive failed");
    } finally {
      setLoading(false);
    }
  };

  // searchNotes(query)
  const searchNotes = (query) => {
    if (!query) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase()) ||
        n.tags.join(" ").toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        createNote,
        updateNote,
        deleteNote,
        toggleArchive,
        searchNotes,
        fetchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);