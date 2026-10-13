import { useState, useEffect } from 'react'

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes') || '[]'))
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!title &&!text) return
    setNotes([{ id: Date.now(), title, text },...notes])
    setTitle(''); setText('')
  }

  const del = (id) => setNotes(notes.filter(n => n.id!== id))

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Notes App</h1>

      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full max-w-md mx-auto block border p-2 rounded mb-4"
      />

      <div className="bg-white max-w-md mx-auto p-3 rounded shadow mb-6">
        <input value={title} onChange={e=>setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full p-2 outline-none font-bold"
        />
        <textarea value={text} onChange={e=>setText(e.target.value)}
          placeholder="Take a note..."
          className="w-full p-2 outline-none"
        />
        <button onClick={addNote} className="bg-yellow-400 px-4 py-1 rounded mt-2">Add</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {filtered.map(n => (
          <div key={n.id} className="bg-white p-3 rounded shadow">
            <h3 className="font-bold">{n.title}</h3>
            <p className="text-sm mt-1">{n.text}</p>
            <button onClick={()=>del(n.id)} className="text-red-500 text-xs mt-2">Delete</button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center text-gray-400 mt-10">No notes</p>}
    </div>
  )
}