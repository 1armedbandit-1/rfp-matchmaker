'use client'

import { ROLE_COLORS, ROLE_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface RoleBadgeProps {
  role: string
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const label = ROLE_LABELS[role] || role
  const colorClass = ROLE_COLORS[role] || 'bg-gray-100 text-gray-800'

  return (
    <span className={cn('inline-block px-3 py-1 rounded-lg text-xs font-semibold', colorClass)}>
      {label}
    </span>
  )
}
