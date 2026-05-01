import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
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

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      display_name,
      city,
      state_region,
      short_bio,
      preferred_contact_method,
      preferred_contact_value,
      profile_photo_url,
    } = body

    const updateData: any = {}
    if (display_name !== undefined) updateData.display_name = display_name
    if (city !== undefined) updateData.city = city
    if (state_region !== undefined) updateData.state_region = state_region
    if (short_bio !== undefined) updateData.short_bio = short_bio
    if (preferred_contact_method !== undefined) updateData.preferred_contact_method = preferred_contact_method
    if (preferred_contact_value !== undefined) updateData.preferred_contact_value = preferred_contact_value
    if (profile_photo_url !== undefined) updateData.profile_photo_url = profile_photo_url
    updateData.updated_at = new Date().toISOString()

    const { data: profile, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select(
        `*,
        fighter_profiles(*),
        trainer_profiles(*),
        manager_profiles(*),
        promoter_profiles(*),
        matchmaker_profiles(*),
        provider_profiles(*)`
      )
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
