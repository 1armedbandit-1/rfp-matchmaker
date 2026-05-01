'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
  autoCloseDuration?: number
}

export function Toast({
  message,
  type,
  onClose,
  autoCloseDuration = 4000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, autoCloseDuration)

    return () => clearTimeout(timer)
  }, [autoCloseDuration, onClose])

  if (!isVisible) return null

  const baseStyles = 'fixed bottom-6 right-6 px-6 py-4 rounded-xl font-semibold text-sm z-50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300'

  const stylesByType = {
    success: 'bg-green-100 text-green-900 border border-green-200',
    error: 'bg-red-100 text-red-900 border border-red-200',
    info: 'bg-blue-100 text-blue-900 border border-blue-200',
  }

  return (
    <div className={cn(baseStyles, stylesByType[type])}>
      {message}
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info'
  }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}
