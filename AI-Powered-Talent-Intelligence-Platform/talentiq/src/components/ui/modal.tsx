"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Modal = DialogPrimitive.Root

const ModalTrigger = DialogPrimitive.Trigger

const ModalPortal = DialogPrimitive.Portal

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[300] bg-[rgba(10,37,64,0.4)] backdrop-blur-[6px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200 ease-out",
      className
    )}
    {...props}
  />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const modalVariants = {
  sm: "max-w-[400px]",
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
  xl: "max-w-[920px]",
  full: "max-w-[95vw] h-[95vh] overflow-y-auto",
}

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: keyof typeof modalVariants
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, size = "md", ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-[301] w-full translate-x-[-50%] translate-y-[-50%] rounded-[var(--radius-xl)] bg-white shadow-xl duration-200 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2",
        modalVariants[size],
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 opacity-70 transition-opacity hover:bg-neutral-100 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:pointer-events-none">
        <X size={20} />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalHeader = ({
  className,
  title,
  subtitle,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: React.ReactNode; subtitle?: React.ReactNode }) => (
  <div
    className={cn("flex flex-col space-y-1 px-6 pb-0 pt-6", className)}
    {...props}
  >
    {title && (
      <DialogPrimitive.Title className="font-display text-[18px] font-semibold tracking-tight text-neutral-900">
        {title}
      </DialogPrimitive.Title>
    )}
    {subtitle && (
      <DialogPrimitive.Description className="font-body text-[14px] text-neutral-500">
        {subtitle}
      </DialogPrimitive.Description>
    )}
  </div>
)
ModalHeader.displayName = "ModalHeader"

const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6", className)} {...props} />
)
ModalBody.displayName = "ModalBody"

const ModalFooter = ({
  className,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmVariant = "primary",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  onCancel?: () => void
  onConfirm?: () => void
  cancelText?: string
  confirmText?: string
  confirmVariant?: "primary" | "destructive"
}) => (
  <div
    className={cn("flex items-center justify-end gap-3 px-6 pb-6", className)}
    {...props}
  >
    {children || (
      <>
        {onCancel && (
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" onClick={onCancel}>{cancelText}</Button>
          </DialogPrimitive.Close>
        )}
        {onConfirm && (
          <Button variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>
        )}
      </>
    )}
  </div>
)
ModalFooter.displayName = "ModalFooter"

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
}
