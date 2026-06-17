"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  error?: string
  helperText?: string
  label?: string
  id?: string
  className?: string
  disabled?: boolean
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    { className, value = "", onChange, error, helperText, label, id, disabled },
    ref
  ) => {
    const editorId = id || React.useId()
    const errorId = `${editorId}-error`
    const helperId = `${editorId}-helper`
    const [isFocused, setIsFocused] = React.useState(false)

    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary-500 underline underline-offset-4",
          },
        }),
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML())
      },
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      editorProps: {
        attributes: {
          class:
            "prose prose-sm prose-neutral max-w-none focus:outline-none min-h-[240px] p-4 font-body text-[15px] text-neutral-900 leading-[24px]",
        },
      },
    })

    // Update editor content if value prop changes externally
    React.useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        const currentSelection = editor.state.selection
        editor.commands.setContent(value, false)
        // Try to restore selection if it makes sense, though often tricky with external updates
        // For simple controlled components, replacing content is enough, but might reset cursor.
      }
    }, [value, editor])

    return (
      <div className="flex w-full flex-col gap-1.5" ref={ref}>
        {label && (
          <label
            htmlFor={editorId}
            className="font-body text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex flex-col rounded-sm border bg-white shadow-sm transition-all duration-150",
            error
              ? "border-[#EF4444] shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
              : isFocused
              ? "border-primary-500 shadow-brand"
              : "border-neutral-200 hover:border-neutral-300",
            disabled && "bg-neutral-50 border-neutral-200 opacity-70 cursor-not-allowed",
            className
          )}
        >
          <div className="flex h-10 items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-2 rounded-t-sm">
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              isActive={editor?.isActive("bold")}
              disabled={disabled}
              aria-label="Toggle bold"
            >
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive("italic")}
              disabled={disabled}
              aria-label="Toggle italic"
            >
              <Italic size={16} />
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-neutral-200" />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              isActive={editor?.isActive("bulletList")}
              disabled={disabled}
              aria-label="Toggle bullet list"
            >
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              isActive={editor?.isActive("orderedList")}
              disabled={disabled}
              aria-label="Toggle ordered list"
            >
              <ListOrdered size={16} />
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-neutral-200" />
            <ToolbarButton
              onClick={() => {
                if (editor?.isActive("link")) {
                  editor.chain().focus().unsetLink().run()
                  return
                }
                const url = window.prompt("Enter link URL:")
                if (url) {
                  editor?.chain().focus().setLink({ href: url }).run()
                }
              }}
              isActive={editor?.isActive("link")}
              disabled={disabled}
              aria-label="Toggle link"
            >
              <LinkIcon size={16} />
            </ToolbarButton>
          </div>
          <EditorContent
            editor={editor}
            id={editorId}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
          />
        </div>
        {error ? (
          <span
            id={errorId}
            className="flex items-center gap-1 font-body text-[12px] text-[#EF4444]"
            aria-live="polite"
          >
            <AlertCircle size={12} />
            {error}
          </span>
        ) : helperText ? (
          <span
            id={helperId}
            className="font-body text-[12px] text-neutral-500"
          >
            {helperText}
          </span>
        ) : null}
      </div>
    )
  }
)
RichTextEditor.displayName = "RichTextEditor"

function ToolbarButton({
  children,
  isActive,
  disabled,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-[4px] text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none",
        isActive
          ? "bg-neutral-200 text-neutral-900"
          : "hover:bg-neutral-200 hover:text-neutral-900"
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { RichTextEditor }
