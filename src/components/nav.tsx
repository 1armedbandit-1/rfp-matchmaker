'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/ui/avatar'
import { UserProfile } from '@/types'
import { Menu, X, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavProps {
  user: UserProfile | null
}

export default function Nav({ user }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }

  const isActive = (path: string) => pathname === path
  const navLinks = [
    { label: 'Feed', href: '/' },
    { label: 'People', href: '/people' },
    { label: 'Find My Match', href: '/match' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-[#1A1A1A]">
          {/* Inline SVG boxing glove icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M14 2C13.45 2 13 2.45 13 3V6H11V3C11 2.45 10.55 2 10 2C9.45 2 9 2.45 9 3V6H6C4.9 6 4 6.9 4 8V18C4 19.1 4.9 20 6 20H14C14.55 20 15 19.55 15 19V3C15 2.45 14.55 2 14 2ZM13 18H6V8H13V18ZM8 10C8.55 10 9 10.45 9 11C9 11.55 8.55 12 8 12C7.45 12 7 11.55 7 11C7 10.45 7.45 10 8 10ZM11 10C11.55 10 12 10.45 12 11C12 11.55 11.55 12 11 12C10.45 12 10 11.55 10 11C10 10.45 10.45 10 11 10ZM8 14C8.55 14 9 14.45 9 15C9 15.55 8.55 16 8 16C7.45 16 7 15.55 7 15C7 14.45 7.45 14 8 14ZM11 14C11.55 14 12 14.45 12 15C12 15.55 11.55 16 11 16C10.45 16 10 15.55 10 15C10 14.45 10.45 14 11 14Z"
              fill="#E63946"
            />
          </svg>
          <span className="hidden sm:inline">The Real Fight Matchmaker</span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'text-[#E63946] font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: User Avatar + Dropdown / Hamburger */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
                aria-label="User menu"
              >
                <Avatar src={user.profile_photo_url} name={user.display_name} size="sm" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#EAEAEA] shadow-lg">
                  <Link
                    href={`/profile/${user.id}`}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#FAFAF7] rounded-t-xl"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      handleSignOut()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#FAFAF7] rounded-b-xl border-t border-[#EAEAEA]"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#EAEAEA] px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-[#FAFAF7] text-[#E63946] font-semibold'
                  : 'text-[#6B6B6B] hover:bg-[#FAFAF7]'
              )}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
