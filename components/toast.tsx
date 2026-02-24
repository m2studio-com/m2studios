"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, X, AlertCircle, Info } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500",
    iconColor: "text-green-500",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500",
    iconColor: "text-yellow-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
    iconColor: "text-blue-500",
  },
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-20 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bgColor} ${config.borderColor} backdrop-blur-sm shadow-lg animate-fade-in-scale max-w-sm`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
      <p className="text-white text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white transition-colors" aria-label="Close">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast hook for easy usage
export function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type: ToastType
    isVisible: boolean
  }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  return { toast, showToast, hideToast }
}
