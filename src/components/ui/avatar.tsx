'use client'

import { cn } from '@/lib/utils'

interface AvatarProps {
  src: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-24 h-24 text-lg',
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  // Generate a color based on the name hash
  const getColorFromName = (str: string): string => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-amber-100 text-amber-800',
      'bg-green-100 text-green-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-cyan-100 text-cyan-800',
    ]
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <div className={cn('overflow-hidden rounded-full', sizeMap[size])}>
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold',
        sizeMap[size],
        getColorFromName(name)
      )}
    >
      {initials}
    </div>
  )
}

export default Avatar
