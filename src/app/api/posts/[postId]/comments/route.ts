// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ postId: string }>
}

// GET: Fetch comments for a post
export async function GET(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()

  const { postId } = await params

  try {
    const { data: comments } = await supabase
      .from('post_comments')
      .select(
        `
        id,
        post_id,
        user_id,
        body,
        created_at,
        users!post_comments_user_id_fkey (
          id,
          display_name,
          profile_photo_url,
          primary_role,
          city,
          state_region
        )
      `
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    const transformedComments = (comments || []).map((c) => ({
      id: c.id,
      post_id: c.post_id,
      user_id: c.user_id,
      body: c.body,
      created_at: c.created_at,
      author: c.users,
    }))

    return NextResponse.json({ comments: transformedComments }, { status: 200 })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST: Create a comment
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
    const { body } = await request.json()

    if (!body || !body.trim()) {
      return NextResponse.json(
        { error: 'Comment body cannot be empty' },
        { status: 400 }
      )
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: session.user.id,
        body: body.trim(),
      })
      .select(
        `
        id,
        post_id,
        user_id,
        body,
        created_at,
        users!post_comments_user_id_fkey (
          id,
          display_name,
          profile_photo_url,
          primary_role,
          city,
          state_region
        )
      `
      )
      .single()

    if (commentError) throw commentError

    // Increment comment_count on post
    const { error: updateError } = await supabase.rpc(
      'increment_post_comments',
      {
        post_id_param: postId,
      }
    )

    if (updateError) {
      // Fallback: read current count and increment manually
      const { data: post } = await supabase.from('posts').select('comment_count').eq('id', postId).single()
      if (post) {
        await supabase.from('posts').update({ comment_count: (post.comment_count || 0) + 1 }).eq('id', postId)
      }
    }

    return NextResponse.json(
      {
        comment: {
          id: comment.id,
          post_id: comment.post_id,
          user_id: comment.user_id,
          body: comment.body,
          created_at: comment.created_at,
          author: comment.users,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
