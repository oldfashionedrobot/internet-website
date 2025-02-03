'use client'

import PageWrapper from '@components/PageWrapper'
import { useEffect, useState } from 'react'
import { Note, notesDb } from '@app/keep/services/notesDb'

import './editor.css'
import { NoteCard } from './components/NoteCard'
import { JSONContent } from '@tiptap/react'

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
    const newNote = await notesDb.addNote(null)
    setNotes((prev) => [...prev, newNote])
    setEditingId(newNote.id)
  }

  // TODO: Handle potential race conditions with concurrent updates
  // Consider implementing:
  // 1. Optimistic updates for better UX
  // 2. Loading state to prevent multiple simultaneous updates
  // 3. Request cancellation for pending updates when new ones come in
  // TODO: Add input validation and handle race conditions:
  // - Validate content structure and title length
  // - Implement optimistic updates
  // - Add loading state to prevent concurrent updates
  // - Consider debouncing rapid changes
  async function handleUpdateNote(
    id: string,
    content: JSONContent,
    title: string | null
  ) {
    if (content.type !== 'doc') {
      throw new Error('Invalid content structure')
    }

    if (title && title.length > 100) {
      throw new Error('Title too long')
    }

    const updatedNote = await notesDb.updateNote(id, content, title)
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? updatedNote : note))
    )
    setEditingId(null)
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
              onSave={(content, title) =>
                handleUpdateNote(note.id, content, title)
              }
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
