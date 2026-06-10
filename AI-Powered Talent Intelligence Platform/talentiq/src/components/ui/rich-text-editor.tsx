'use client'

/**
 * TalentIQ Rich Text Editor — Section 2.2 (Rich Text Editor / Job Description)
 *
 * Outer container: same border treatment as text input
 * Focus: border primary-500 / shadow-brand on outer container
 *
 * Toolbar (40px):
 *   background: neutral-50 | border-bottom: border-default | padding: 0 8px
 *   Buttons: Bold | Italic | BulletList | OrderedList | Link (each 28px icon button)
 *
 * Content area:
 *   min-height: 240px | padding: 16px | font: Inter 15px neutral-900
 */

import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Toolbar Button ──────────────────────────────────────────────────────────
function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center justify-center',
        'w-7 h-7 rounded-xs',
        'transition-colors duration-[80ms]',
        'focus-visible:outline-none focus-visible:shadow-brand',
        'disabled:opacity-40 disabled:pointer-events-none',
        active
          ? 'bg-primary-100 text-primary-700'
          : 'text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
      )}
    >
      {children}
    </button>
  )
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────
export interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  className?: string
  id?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your job description here…',
  disabled,
  error,
  className,
  id,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary-600 underline cursor-pointer' },
      }),
    ],
    content: value ?? '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        id: id ?? '',
        class: cn(
          'min-h-[240px] px-4 py-4 outline-none',
          'font-body text-[15px] text-neutral-900 leading-6',
          // Prose styles for the editor content
          '[&_p]:mb-3 [&_p:last-child]:mb-0',
          '[&_strong]:font-semibold',
          '[&_em]:italic',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3',
          '[&_li]:mb-1',
          '[&_a]:text-primary-600 [&_a]:underline',
          // Placeholder
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-text'
        ),
      },
    },
  })

  // Keep editor in sync with external value changes
  React.useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  // Track focus for container border
  const [focused, setFocused] = React.useState(false)

  return (
    <div
      className={cn(
        // Container mimics text input border
        'w-full rounded-sm border bg-white',
        'transition-[border-color,box-shadow] duration-[120ms] ease-out',
        // States
        focused
          ? 'border-primary-500 shadow-brand'
          : error
            ? 'border-[#EF4444] shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
            : 'border-neutral-200 hover:border-neutral-300',
        disabled && 'bg-neutral-50 border-neutral-200',
        'overflow-hidden',
        className
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          'h-10 flex items-center gap-1 px-2',
          'bg-neutral-50 border-b border-neutral-200',
          disabled && 'opacity-50 pointer-events-none'
        )}
        role="toolbar"
        aria-label="Text formatting"
      >
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive('bold')}
          label="Bold"
        >
          <Bold size={14} aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive('italic')}
          label="Italic"
        >
          <Italic size={14} aria-hidden="true" />
        </ToolbarButton>

        <div className="w-px h-4 bg-neutral-200 mx-1" role="separator" />

        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive('bulletList')}
          label="Bullet List"
        >
          <List size={14} aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive('orderedList')}
          label="Ordered List"
        >
          <ListOrdered size={14} aria-hidden="true" />
        </ToolbarButton>

        <div className="w-px h-4 bg-neutral-200 mx-1" role="separator" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) {
              editor?.chain().focus().setLink({ href: url }).run()
            }
          }}
          active={editor?.isActive('link')}
          label="Add Link"
        >
          <LinkIcon size={14} aria-hidden="true" />
        </ToolbarButton>
      </div>

      {/* ── Content area ──────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className={cn(
          '[&_.ProseMirror]:min-h-[240px]',
          '[&_.ProseMirror]:px-4 [&_.ProseMirror]:py-4',
          '[&_.ProseMirror]:outline-none',
          // Placeholder
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-neutral-400',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
        )}
      />
    </div>
  )
}
