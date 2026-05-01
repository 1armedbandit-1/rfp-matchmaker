// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/avatar'
import { RoleBadge } from '@/components/ui/role-badge'
import { UserProfile, MatchResult } from '@/types'
import Link from 'next/link'

export default function MatchPage() {
  const supabase = createClient()

  // States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [additionalContext, setAdditionalContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [cachedAt, setCachedAt] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [subText, setSubText] = useState('Analyzing profiles...')

  // Load current user and check cache
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setCurrentUser(profile as UserProfile)

          // Check for cached results
          const { data: cached } = await supabase
            .from('match_requests')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (cached) {
            setMatches(cached.response_payload || [])
            setCachedAt(cached.created_at)
            setShowResults(true)
          }
        }
      }
    }

    loadUser()
  }, [supabase])

  // Cycle sub-text during loading
  useEffect(() => {
    if (!loading) return

    const texts = ['Analyzing profiles...', 'Checking compatibility...', 'Ranking your best fits...']
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setSubText(texts[index])
    }, 2000)

    return () => clearInterval(interval)
  }, [loading])

  const handleFindMatches = async () => {
    setLoading(true)
    setShowResults(false)
    setMatches([])

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additional_context: additionalContext }),
      })

      if (!response.ok) throw new Error('Failed to find matches')

      const data = await response.json()
      setMatches(data.matches || [])
      setCachedAt(null)
      setShowResults(true)
    } catch (error) {
      console.error('Error finding matches:', error)
      alert('Failed to find matches. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setAdditionalContext('')
    setMatches([])
    setCachedAt(null)
    setShowResults(false)
  }

  const getMatchColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-amber-100 text-amber-800'
    return 'bg-gray-100 text-gray-700'
  }

  const isFormValid = additionalContext.trim().length > 0 && additionalContext.length <= 500

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero Section */}
      {!showResults && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find My Match</h1>
            <p className="text-base text-gray-600">Tell us what you need. We'll find people who fit.</p>
          </div>

          {/* Input Card */}
          <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm p-6 mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Additional context (optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value.slice(0, 500))}
              placeholder="e.g. I'm a 165lb pro boxer in West Virginia looking for a manager who has experience placing fighters on regional cards..."
              className="w-full min-h-32 px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946] font-medium resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">{additionalContext.length}/500 characters</p>
            </div>

            {/* Button */}
            {!loading ? (
              <button
                onClick={handleFindMatches}
                disabled={!isFormValid}
                className="w-full mt-6 px-6 py-3 rounded-xl bg-[#E63946] text-white font-semibold hover:bg-[#c72d3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Find My Matches
              </button>
            ) : (
              <div className="w-full mt-6 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#E63946] animate-pulse"></span>
                    <span
                      className="inline-block w-2 h-2 rounded-full bg-[#E63946] animate-pulse"
                      style={{ animationDelay: '0.1s' }}
                    ></span>
                    <span
                      className="inline-block w-2 h-2 rounded-full bg-[#E63946] animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                  </div>
                  <span>Looking through the community for your matches…</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{subText}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Results Section */}
      {showResults && matches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Top Matches{' '}
                <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold ml-2">
                  {matches.length}
                </span>
              </h2>
              {cachedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated {new Date(cachedAt).toLocaleDateString()} at{' '}
                  {new Date(cachedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <button
              onClick={handleRefresh}
              className="text-sm font-semibold text-[#E63946] hover:text-[#c72d3a] transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {matches.map((match, index) => {
              const profile = match.profile as UserProfile
              const location = [profile.city, profile.state_region].filter(Boolean).join(', ')

              return (
                <div
                  key={profile.id}
                  className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar src={profile.profile_photo_url} name={profile.display_name} size="lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-gray-900">{profile.display_name}</h3>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <RoleBadge role={profile.primary_role} />
                          {location && <span className="text-xs text-gray-500">{location}</span>}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getMatchColor(match.score)}`}>
                      {match.score}% match
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Why you're a fit:</label>
                    <p className="text-sm text-gray-600 italic">{match.reasoning}</p>
                  </div>

                  <Link href={`/profile/${profile.id}`}>
                    <button className="text-sm font-semibold text-[#E63946] border border-[#E63946] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                      View Profile →
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No Matches State */}
      {showResults && matches.length === 0 && (
        <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm p-8 text-center">
          <p className="text-gray-600 mb-6">
            We couldn't find strong matches right now. Try adding more detail to your context, or check back as more
            members join.
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 rounded-xl bg-[#E63946] text-white font-semibold hover:bg-[#c72d3a] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
