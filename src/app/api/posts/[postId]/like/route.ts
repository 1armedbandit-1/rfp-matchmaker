// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ postId: string }>
}

// POST: Like a post
export async function POST(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await params

  try {
    // Check if already liked
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', session.user.id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 400 }
      )
    }

    // Insert like
    const { error: likeError } = await supabase.from('post_likes').insert({
      post_id: postId,
      user_id: session.user.id,
    })

    if (likeError) throw likeError

    // Increment like_count
    const { error: updateError } = await supabase.rpc('increment_post_likes', {
      post_id_param: postId,
    })

    if (updateError) {
      // Fallback: manual update if RPC doesn't exist
      await supabase
        .from('posts')
        .update({ like_count: supabase.rpc('coalesce', ['like_count', 0]).gt(0) })
        .eq('id', postId)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    )
  }
}

// DELETE: Unlike a post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await params

  try {
    // Delete like
    const { error: deleteError } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', session.user.id)

    if (deleteError) throw deleteError

    // Decrement like_count
    const { error: updateError } = await supabase.rpc(
      'decrement_post_likes',
      {
        post_id_param: postId,
      }
    )

    if (updateError) {
      // Fallback: manual update if RPC doesn't exist
      await supabase
        .from('posts')
        .update({ like_count: supabase.rpc('coalesce', ['like_count', 0]).gt(0) })
        .eq('id', postId)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error unliking post:', error)
    return NextResponse.json(
      { error: 'Failed to unlike post' },
      { status: 500 }
    )
  }
}
