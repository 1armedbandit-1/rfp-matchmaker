import { createClient } from '@/lib/supabase/server'
import PostComposer from '@/components/post-composer'
import PostCard from '@/components/post-card'
import Sidebar from '@/components/sidebar'
import { Post, UserProfile } from '@/types'

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Fetch current user profile
  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', session?.user.id)
    .single()

  // Fetch posts with author data
  const { data: postsData } = await supabase
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
    `
    )
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch like info for current user
  const postIds = postsData?.map((p) => p.id) || []
  let userLikes: string[] = []
  if (postIds.length > 0) {
    const { data: likesData } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', session?.user.id)
      .in('post_id', postIds)

    userLikes = likesData?.map((l) => l.post_id) || []
  }

  // Transform posts to match Post type
  const posts: Post[] = (postsData || []).map((p) => ({
    id: p.id,
    user_id: p.user_id,
    body: p.body,
    media_url: p.media_url,
    like_count: p.like_count,
    comment_count: p.comment_count,
    created_at: p.created_at,
    author: p.users as unknown as UserProfile,
    user_has_liked: userLikes.includes(p.id),
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left Column: Feed */}
        <div>
          {currentUser && <PostComposer user={currentUser as UserProfile} onPost={() => {}} />}

          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={session?.user.id || ''}
              />
            ))
          ) : (
            <div className="rounded-2xl bg-white border border-[#EAEAEA] p-12 shadow-sm text-center">
              <p className="text-[#6B6B6B] font-medium">
                Be the first to post — introduce yourself to the community. 👋
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="hidden lg:block">
          {session?.user.id && <Sidebar currentUserId={session.user.id} />}
        </div>
      </div>
    </div>
  )
}
