// @ts-nocheck
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { user: userFields, role_profile: roleProfileFields } = body

    if (!userFields || !roleProfileFields) {
      return NextResponse.json(
        { error: 'Missing user or role_profile data' },
        { status: 400 }
      )
    }

    // Determine the primary role from the role_profile
    const primaryRole = userFields.primary_role

    if (!primaryRole) {
      return NextResponse.json(
        { error: 'Missing primary_role in user data' },
        { status: 400 }
      )
    }

    // Update users table with is_profile_complete = true
    const userUpdateData = {
      ...userFields,
      is_profile_complete: true,
      updated_at: new Date().toISOString(),
    }

    const { error: userError, data: updatedUser } = await supabase
      .from('users')
      .update(userUpdateData)
      .eq('id', user.id)
      .select('*')
      .single()

    if (userError || !updatedUser) {
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 400 })
    }

    // Determine which role-specific table to upsert to
    const roleTableMap: Record<string, string> = {
      fighter: 'fighter_profiles',
      trainer: 'trainer_profiles',
      manager: 'manager_profiles',
      promoter: 'promoter_profiles',
      matchmaker: 'matchmaker_profiles',
      provider: 'provider_profiles',
    }

    const roleTable = roleTableMap[primaryRole]

    if (!roleTable) {
      return NextResponse.json({ error: 'Invalid primary_role' }, { status: 400 })
    }

    // Upsert role-specific profile
    const roleUpdateData = {
      user_id: user.id,
      ...roleProfileFields,
    }

    const { error: roleError, data: updatedRoleProfile } = await supabase
      .from(roleTable)
      .upsert(roleUpdateData, { onConflict: 'user_id' })
      .select('*')
      .single()

    if (roleError || !updatedRoleProfile) {
      return NextResponse.json(
        { error: `Failed to update ${roleTable}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      role_profile: updatedRoleProfile,
    })
  } catch (error) {
    console.error('Profile complete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
