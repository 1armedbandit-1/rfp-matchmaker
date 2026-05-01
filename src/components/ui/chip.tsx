'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface ChipProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  label?: string
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
}

export default function Chip({
  children,
  variant = 'primary',
  className,
  label,
  selected = false,
  onClick,
  disabled = false,
}: ChipProps) {
  // Display mode (for profiles)
  if (!onClick) {
    return (
      <span
        className={cn(
          'inline-block px-3 py-1.5 rounded-lg text-xs font-medium',
          variant === 'primary'
            ? 'bg-[#FFE5E8] text-[#E63946]'
            : 'bg-[#E8F4F8] text-[#0066CC]',
          className
        )}
      >
        {label || children}
      </span>
    )
  }

  // Interactive mode (for forms)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 border-2',
        selected
          ? 'bg-[#E63946] text-white border-[#E63946]'
          : 'bg-white text-[#1A1A1A] border-[#EAEAEA] hover:border-[#E63946]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {label || children}
    </button>
  )
}
