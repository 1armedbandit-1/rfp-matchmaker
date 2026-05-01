import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { target_user_id, contact_method } = await request.json()

    if (!target_user_id) {
      return NextResponse.json(
        { error: 'target_user_id is required' },
        { status: 400 }
      )
    }

    // Log the contact reveal
    const { error } = await supabase.from('contact_reveals').insert({
      viewer_user_id: session.user.id,
      target_user_id,
      contact_method: contact_method || null,
      revealed_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error logging contact reveal:', error)
    return NextResponse.json(
      { error: 'Failed to log contact reveal' },
      { status: 500 }
    )
  }
}
