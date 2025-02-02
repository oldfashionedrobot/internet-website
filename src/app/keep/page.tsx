'use client'

import PageWrapper from '@components/PageWrapper'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { Note, notesDb } from '@services/notesDb'

export default function KeepPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // Initialize DB and load notes
  useEffect(() => {
    async function init() {
      await notesDb.init()
      const allNotes = await notesDb.getAllNotes()
      setNotes(allNotes)
    }
    init()
  }, [])

  async function handleAddNote() {
    const newNote = await notesDb.addNote('')
    setNotes((prev) => [...prev, newNote])
    setEditingId(newNote.id)
  }

  async function handleUpdateNote(id: string, content: string) {
    const updatedNote = await notesDb.updateNote(id, content)
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? updatedNote : note))
    )
  }

  async function handleDeleteNote(id: string) {
    await notesDb.deleteNote(id)
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  return (
    <PageWrapper title="Keep">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleAddNote}
          className="self-start px-4 py-2 bg-green text-white rounded hover:bg-opacity-90"
        >
          Add Note
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={editingId === note.id}
              onEdit={() => setEditingId(note.id)}
              onSave={(content) => {
                handleUpdateNote(note.id, content)
                setEditingId(null)
              }}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

type NoteCardProps = {
  note: Note
  isEditing: boolean
  onEdit: () => void
  onSave: (content: string) => void
  onDelete: () => void
}

function NoteCard({ note, isEditing, onEdit, onSave, onDelete }: NoteCardProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    editable: isEditing
  })

  if (!editor) return null

  return (
    <div className="p-4 rounded-lg border border-gray hover:shadow-lg transition-shadow">
      <div className="flex justify-between mb-2">
        <div className="text-sm text-gray">
          {new Date(note.updated).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={() => onSave(editor.getHTML())}
              className="text-green hover:underline"
            >
              Save
            </button>
          ) : (
            <button onClick={onEdit} className="text-blue hover:underline">
              Edit
            </button>
          )}
          <button onClick={onDelete} className="text-red hover:underline">
            Delete
          </button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
} 