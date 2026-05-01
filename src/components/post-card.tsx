'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Post, Comment } from '@/types'
import { relativeTime } from '@/lib/utils'
import Avatar from '@/components/ui/avatar'
import RoleBadge from '@/components/ui/role-badge'
import { Heart, MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
  currentUserId: string
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.user_has_liked || false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentBody, setCommentBody] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const handleLike = async () => {
    try {
      if (liked) {
        // Unlike
        await fetch(`/api/posts/${post.id}/like`, { method: 'DELETE' })
        setLikeCount(likeCount - 1)
        setLiked(false)
      } else {
        // Like
        await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
        setLikeCount(likeCount + 1)
        setLiked(true)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const loadComments = async () => {
    if (isLoadingComments || comments.length > 0) return

    setIsLoadingComments(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleShowComments = async () => {
    if (!showComments) {
      await loadComments()
    }
    setShowComments(!showComments)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentBody.trim()) return

    setIsSubmittingComment(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentBody.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments([...comments, data.comment])
        setCommentBody('')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  return (
    <article className="rounded-2xl bg-white border border-[#EAEAEA] p-5 shadow-sm mb-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Link href={`/profile/${post.user_id}`}>
          <Avatar src={post.author?.profile_photo_url} name={post.author?.display_name} size="sm" />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${post.user_id}`}
              className="font-semibold text-sm text-[#1A1A1A] hover:text-[#E63946]"
            >
              {post.author?.display_name}
            </Link>
            {post.author?.primary_role && <RoleBadge role={post.author.primary_role} />}
          </div>
          <p className="text-xs text-[#6B6B6B] mt-1">
            {post.author?.city && post.author?.state_region
              ? `${post.author.city}, ${post.author.state_region}`
              : 'Location not provided'}
          </p>
          <p className="text-xs text-[#6B6B6B]">{relativeTime(post.created_at)}</p>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap mb-3">{post.body}</p>

      {/* Media */}
      {post.media_url && (
        <img
          src={post.media_url}
          alt="Post media"
          className="w-full rounded-xl object-cover max-h-80 mb-3"
        />
      )}

      {/* Footer: Like and Comment Buttons */}
      <div className="flex items-center gap-4 text-sm font-medium pt-3 border-t border-[#EAEAEA]">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#E63946] transition-colors"
        >
          <Heart
            size={18}
            className={cn(liked && 'fill-[#E63946] text-[#E63946]')}
          />
          <span>{likeCount}</span>
        </button>

        <button
          onClick={handleShowComments}
          className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#E63946] transition-colors"
        >
          <MessageCircle size={18} />
          <span>{post.comment_count}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[#EAEAEA] space-y-3">
          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar
                    src={comment.author?.profile_photo_url}
                    name={comment.author?.display_name}
                    size="xs"
                  />
                  <div className="flex-1 bg-[#FAFAF7] rounded-lg p-2.5">
                    <Link
                      href={`/profile/${comment.user_id}`}
                      className="text-xs font-semibold text-[#1A1A1A] hover:text-[#E63946]"
                    >
                      {comment.author?.display_name}
                    </Link>
                    <p className="text-xs text-[#1A1A1A] mt-1">{comment.body}</p>
                    <p className="text-xs text-[#6B6B6B] mt-1">
                      {relativeTime(comment.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex gap-2 pt-2">
            <Avatar src={null} name="You" size="xs" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border border-[#EAEAEA] bg-[#FAFAF7] px-3 py-2 text-xs text-[#1A1A1A] placeholder-[#6B6B6B] focus:border-[#E63946] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentBody.trim() || isSubmittingComment}
                className="bg-[#E63946] hover:bg-[#c72d3a] disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                Reply
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  )
}
