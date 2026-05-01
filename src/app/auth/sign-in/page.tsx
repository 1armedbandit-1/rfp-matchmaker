'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/ui/toast'

export default function SignInPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [magicLinkEmail, setMagicLinkEmail] = useState('')
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error' })
      return
    }

    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setToast({ message: error.message, type: 'error' })
      setIsLoading(false)
    } else {
      router.push('/home')
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magicLinkEmail) {
      setToast({ message: 'Please enter your email', type: 'error' })
      return
    }

    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: magicLinkEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
      },
    })

    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setMagicLinkSent(true)
      setToast({ message: 'Check your email for a sign-in link', type: 'success' })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background-app flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-DEFAULT p-8 mb-6">
          {!showMagicLink ? (
            <form onSubmit={handleSignIn} className="space-y-4">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-fight-red hover:bg-red-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-DEFAULT"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-muted">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMagicLink(true)}
                className="w-full text-fight-red hover:text-red-700 font-semibold py-2 transition-colors"
              >
                Sign in with a magic link
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={magicLinkEmail}
                  onChange={(e) => setMagicLinkEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={magicLinkSent}
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary placeholder-text-muted focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors disabled:bg-gray-50"
                />
              </div>

              {magicLinkSent && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
                  Check your email for a sign-in link
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || magicLinkSent}
                className="w-full bg-fight-red hover:bg-red-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMagicLink(false)
                  setMagicLinkEmail('')
                  setMagicLinkSent(false)
                }}
                className="w-full text-fight-red hover:text-red-700 font-semibold py-2 transition-colors"
              >
                Back to email & password
              </button>
            </form>
          )}

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <a href="#" className="text-fight-red hover:text-red-700 font-semibold text-sm">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-text-muted">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="text-fight-red hover:text-red-700 font-semibold">
              Join the community →
            </Link>
          </p>
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
