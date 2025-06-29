"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed z-[9999] flex max-h-screen w-full flex-col-reverse gap-2",
      "bottom-20 left-2 right-2 max-w-[calc(100vw-2rem)]",
      "sm:bottom-16 sm:right-4 sm:left-auto sm:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start space-x-2 overflow-hidden border p-4 shadow-win98-outer bg-[#c0c0c0] border-[#808080] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-[#808080] bg-[#c0c0c0]",
        destructive:
          "border-[#ff0000] bg-[#c0c0c0]",
      },
      size: {
        default: "p-4",
        mobile: "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, size, duration = 3000, ...props }, ref) => {
  const [progress, setProgress] = React.useState(100)
  const stepTime = 100
  const steps = duration / stepTime

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - (100 / steps)
      })
    }, stepTime)

    return () => clearInterval(timer)
  }, [steps])

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), "pb-6", className)}
      duration={duration}
      {...props}
    >
      {props.children}
      <div className={cn(
        "absolute bottom-0 left-0 right-2 h-2 border border-[#808080] shadow-win98-inner mx-4 mb-2 overflow-hidden",
        size === "mobile" && "h-1.5 mx-2 mb-1.5"
      )}>
        <div 
          className="h-full bg-uni-bg-01 shadow-win98-outer transition-all duration-100 ease-linear" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex shrink-0 items-center justify-center border border-[#808080] bg-[#c0c0c0] px-3 text-sm font-medium shadow-win98-outer active:shadow-win98-inner hover:bg-[#d4d4d4] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
      "h-10 sm:h-8",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 flex items-center justify-center border border-[#808080] bg-[#c0c0c0] shadow-win98-outer active:shadow-win98-inner hover:bg-[#d4d4d4]",
      "h-6 w-6 sm:h-5 sm:w-5",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4 sm:h-3 sm:w-3" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & { children: React.ReactNode }
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "font-bold text-black mb-1 flex items-center gap-2",
      "text-base sm:text-sm",
      className
    )}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-black",
      "text-base sm:text-sm",
      className
    )}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
