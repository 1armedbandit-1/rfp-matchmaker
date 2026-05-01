// @ts-nocheck
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { findMatches } from '@/lib/anthropic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { additional_context } = await request.json()

    // Check 24h cache
    const { data: cached } = await supabase
      .from('match_requests')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (cached && !additional_context) {
      return NextResponse.json({
        matches: cached.response_payload,
        cached: true,
        cached_at: cached.created_at,
      })
    }

    // Load requester full profile
    const { data: requesterProfile, error: requesterError } = await supabase
      .from('users')
      .select(
        `*,
        fighter_profiles(*),
        trainer_profiles(*),
        manager_profiles(*),
        promoter_profiles(*),
        matchmaker_profiles(*),
        provider_profiles(*)`
      )
      .eq('id', user.id)
      .single()

    if (requesterError || !requesterProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Determine what requester is looking for
    const requesterLookingFor = [
      ...(requesterProfile.fighter_profiles?.[0]?.looking_for || []),
      ...(requesterProfile.trainer_profiles?.[0]?.looking_for || []),
      ...(requesterProfile.manager_profiles?.[0]?.looking_for || []),
      ...(requesterProfile.promoter_profiles?.[0]?.looking_for || []),
      ...(requesterProfile.matchmaker_profiles?.[0]?.looking_for || []),
      ...(requesterProfile.provider_profiles?.[0]?.looking_for || []),
    ]

    // Load candidates (all complete profiles)
    const { data: candidates, error: candidatesError } = await supabase
      .from('users')
      .select(
        `*,
        fighter_profiles(*),
        trainer_profiles(*),
        manager_profiles(*),
        promoter_profiles(*),
        matchmaker_profiles(*),
        provider_profiles(*)`
      )
      .eq('is_profile_complete', true)
      .neq('id', user.id)
      .limit(80)

    if (candidatesError || !candidates || candidates.length === 0) {
      return NextResponse.json({ matches: [] })
    }

    // Pre-filter to same state or nearby (simple: same state first, then all)
    const sameState = candidates.filter((c: any) => c.state_region === requesterProfile.state_region)
    const pool = sameState.length >= 10 ? sameState : candidates.slice(0, 30)

    // AI Matchmaking — requires ANTHROPIC_API_KEY
    // To enable: add your key to .env.local and this will activate automatically
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        matches: [],
        ai_disabled: true,
        message: 'AI matchmaking coming soon — add ANTHROPIC_API_KEY to enable',
      })
    }

    // Call Claude to find matches
    const rawMatches = await findMatches(requesterProfile, pool.slice(0, 30), additional_context)

    // Enrich matches with full profiles
    const enrichedMatches = rawMatches
      .map((m) => {
        const profile = candidates.find((c: any) => c.id === m.user_id)
        return profile ? { ...m, profile } : null
      })
      .filter((m) => m !== null)

    // Save to cache
    await supabase.from('match_requests').insert({
      user_id: user.id,
      request_payload: { additional_context, requester_state: requesterProfile.state_region },
      response_payload: enrichedMatches,
    })

    return NextResponse.json({ matches: enrichedMatches, cached: false })
  } catch (error) {
    console.error('Match API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
