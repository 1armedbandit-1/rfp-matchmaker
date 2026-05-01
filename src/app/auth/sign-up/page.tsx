'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/ui/toast'
import { Chip } from '@/components/ui/chip'
import { ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@/types/index'

const ROLE_ICONS: Record<string, string> = {
  fighter: '🥊',
  trainer: '💪',
  manager: '📋',
  promoter: '🎤',
  matchmaker: '🤝',
  provider: '🏥',
}

const ROLES: UserRole[] = ['fighter', 'trainer', 'manager', 'promoter', 'matchmaker', 'provider']

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName || !email || !password || !confirmPassword || !selectedRole) {
      setToast({ message: 'Please fill in all fields and select a role', type: 'error' })
      return
    }

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' })
      return
    }

    if (password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }

    setIsLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            primary_role: selectedRole,
          },
        },
      })

      if (signUpError) {
        setToast({ message: signUpError.message, type: 'error' })
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setToast({ message: 'Failed to create account', type: 'error' })
        setIsLoading(false)
        return
      }

      // public.users row is auto-created by the on_auth_user_created DB trigger
      // (display_name and primary_role flow via signUp metadata above)

      setToast({ message: 'Account created! Redirecting to onboarding...', type: 'success' })

      // Redirect to onboarding
      setTimeout(() => {
        router.push('/onboarding')
      }, 1000)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-app flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🥊</div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            The Real Fight Matchmaker
          </h1>
          <p className="text-text-muted">
            Where fighters, trainers, managers, and promoters find each other.
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-DEFAULT p-8 mb-6">
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary placeholder-text-muted focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary placeholder-text-muted focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary placeholder-text-muted focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary placeholder-text-muted focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-4">
                What best describes you?
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      selectedRole === role
                        ? 'border-fight-red bg-red-50'
                        : 'border-border-DEFAULT hover:border-fight-red bg-white'
                    }`}
                  >
                    <div className="text-2xl">{ROLE_ICONS[role]}</div>
                    <span className="text-sm font-semibold text-text-primary text-center">
                      {ROLE_LABELS[role]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fight-red hover:bg-red-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-text-muted">
              Already a member?{' '}
              <Link href="/auth/sign-in" className="text-fight-red hover:text-red-700 font-semibold">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
