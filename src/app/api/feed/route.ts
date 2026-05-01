// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch paginated posts
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const page = request.nextUrl.searchParams.get('page') || '0'
  const limit = request.nextUrl.searchParams.get('limit') || '20'
  const pageNum = parseInt(page)
  const limitNum = parseInt(limit)
  const offset = pageNum * limitNum

  try {
    // Fetch posts with authors
    const { data: posts, count } = await supabase
      .from('posts')
      .select(
        `
        id,
        user_id,
        body,
        media_url,
        like_count,
        comment_count,
        created_at,
        users!posts_user_id_fkey (
          id,
          display_name,
          profile_photo_url,
          primary_role,
          city,
          state_region
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (!posts) {
      return NextResponse.json({ posts: [], total: 0 })
    }

    const postIds = posts.map((p) => p.id)

    // Fetch user's likes
    const { data: userLikes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', session.user.id)
      .in('post_id', postIds)

    const userLikedPostIds = new Set(userLikes?.map((l) => l.post_id) || [])

    const transformedPosts = posts.map((p) => ({
      id: p.id,
      user_id: p.user_id,
      body: p.body,
      media_url: p.media_url,
      like_count: p.like_count,
      comment_count: p.comment_count,
      created_at: p.created_at,
      author: p.users,
      user_has_liked: userLikedPostIds.has(p.id),
    }))

    return NextResponse.json({ posts: transformedPosts, total: count || 0 })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST: Create a new post
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { body, media_url } = await request.json()

    if (!body || !body.trim()) {
      return NextResponse.json(
        { error: 'Post body cannot be empty' },
        { status: 400 }
      )
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: session.user.id,
        body: body.trim(),
        media_url: media_url || null,
        like_count: 0,
        comment_count: 0,
      })
      .select(
        `
        id,
        user_id,
        body,
        media_url,
        like_count,
        comment_count,
        created_at,
        users!posts_user_id_fkey (
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

    if (error) throw error

    return NextResponse.json(
      {
        post: {
          ...post,
          author: post.users,
          user_has_liked: false,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
