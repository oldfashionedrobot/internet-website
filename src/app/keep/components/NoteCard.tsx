'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { Note } from '@app/keep/services/notesDb'

type NoteCardProps = {
  note: Note
  isEditing: boolean
  onEdit: () => void
  onSave: (content: JSONContent, title: string | null) => void
  onDelete: () => void
}

export function NoteCard({
  note,
  isEditing,
  onEdit,
  onSave,
  onDelete
}: NoteCardProps) {
  const [title, setTitle] = useState<string | null>(note.title)
  const [content, setContent] = useState<JSONContent>(note.content)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: 'Write something...'
      })
    ],
    content,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      if (isEditing) {
        setContent(editor.getJSON())
      }
    }
  })

  useEffect(() => {
    editor?.setEditable(isEditing)

    return () => editor?.destroy()
  }, [editor, isEditing])

  if (!editor) return null

  return (
    <div className="p-4 rounded-lg border border-gray hover:shadow-lg transition-shadow">
      <div className="flex justify-between mb-2">
        <div className="flex flex-col gap-2">
          {isEditing ? (
            <input
              type="text"
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="px-2 py-1 border rounded"
            />
          ) : (
            <div className="text-lg font-bold">{title || 'Untitled'}</div>
          )}
          <div className="text-sm text-gray">
            {new Date(note.updated).toLocaleDateString()}
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={() => onSave(content, title)}
              className="text-green hover:underline"
            >
              Done
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

      {isEditing && (
        <div className="border-b border-gray-light mb-2 pb-2 flex gap-2 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-light' : ''}`}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-light' : ''}`}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-light' : ''}`}
            title="Strike"
          >
            S
          </button>
          <div className="w-px bg-gray-light mx-1" />
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-light' : ''}`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-light' : ''}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-light' : ''}`}
            title="Heading 3"
          >
            H3
          </button>
          <div className="w-px bg-gray-light mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-light' : ''}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-light' : ''}`}
            title="Numbered List"
          >
            1.
          </button>
          <div className="w-px bg-gray-light mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded"
            title="Undo"
          >
            ↩
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded"
            title="Redo"
          >
            ↪
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
