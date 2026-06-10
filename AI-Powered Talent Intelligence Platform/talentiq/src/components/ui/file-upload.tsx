"use client"

import * as React from "react"
import { UploadCloud, FileIcon, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FileUploadZoneProps {
  onFileSelect?: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  error?: string
  helperText?: string
  label?: string
  id?: string
  disabled?: boolean
  file?: File | null
  className?: string
}

const FileUploadZone = React.forwardRef<HTMLInputElement, FileUploadZoneProps>(
  (
    {
      className,
      onFileSelect,
      accept = ".pdf",
      maxSizeMB = 10,
      error,
      helperText,
      label,
      id,
      disabled,
      file,
    },
    ref
  ) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [internalFile, setInternalFile] = React.useState<File | null>(null)
    const [internalError, setInternalError] = React.useState<string | null>(null)

    // Sync with external file prop if controlled
    const currentFile = file !== undefined ? file : internalFile
    const displayError = error || internalError

    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFile = (selectedFile: File) => {
      setInternalError(null)
      
      // Basic validation
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setInternalError(`File size exceeds ${maxSizeMB}MB limit.`)
        return
      }

      setInternalFile(selectedFile)
      onFileSelect?.(selectedFile)
    }

    const onDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      if (disabled) return
      setIsDragOver(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      if (disabled) return
      setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (disabled) return

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0])
      }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0])
      }
    }

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      setInternalFile(null)
      setInternalError(null)
      onFileSelect?.(null)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}

        <div
          onClick={() => !disabled && !currentFile && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-[32px] py-[40px] text-center transition-all duration-[120ms]",
            isDragOver
              ? "border-primary-400 bg-primary-50"
              : displayError
              ? "border-[#EF4444] bg-neutral-50"
              : currentFile
              ? "border-neutral-200 bg-white"
              : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
        >
          <input
            ref={(node) => {
              if (typeof ref === "function") ref(node)
              else if (ref) ref.current = node
              // @ts-ignore
              inputRef.current = node
            }}
            id={inputId}
            type="file"
            accept={accept}
            onChange={onChange}
            disabled={disabled}
            className="hidden"
            aria-invalid={!!displayError}
            aria-describedby={
              displayError ? errorId : helperText ? helperId : undefined
            }
          />

          {currentFile ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <FileIcon size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-body text-[14px] font-medium text-neutral-900 truncate max-w-[200px] sm:max-w-[300px]">
                    {currentFile.name}
                  </span>
                  <span className="font-body text-[12px] text-neutral-500">
                    {formatFileSize(currentFile.size)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] disabled:pointer-events-none"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud
                size={32}
                className={cn(
                  "mb-3 transition-colors",
                  isDragOver ? "text-primary-500" : "text-neutral-400"
                )}
              />
              <p
                className={cn(
                  "font-body text-[14px] font-semibold transition-colors",
                  isDragOver ? "text-primary-500" : "text-neutral-700"
                )}
              >
                Drag your resume here
              </p>
              <p
                className={cn(
                  "mt-1 font-body text-[12px] transition-colors",
                  isDragOver ? "text-primary-500" : "text-neutral-500"
                )}
              >
                or click to browse — PDF up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>

        {displayError ? (
          <span
            id={errorId}
            className="flex items-center gap-1 font-body text-[12px] text-[#EF4444]"
            aria-live="polite"
          >
            <AlertCircle size={12} />
            {displayError}
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
FileUploadZone.displayName = "FileUploadZone"

export { FileUploadZone }
