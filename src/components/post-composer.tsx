'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/ui/avatar'
import { UserProfile, Post } from '@/types'
import { Camera, X } from 'lucide-react'

interface PostComposerProps {
  user: UserProfile
  onPost: (post: Post) => void
}

export default function PostComposer({ user, onPost }: PostComposerProps) {
  const [body, setBody] = useState('')
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
    // Auto-expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('posts')
        .upload(`${user.id}/${fileName}`, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(`${user.id}/${fileName}`)

      setMediaUrl(urlData.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      setMediaPreview(null)
    }
  }

  const removeImage = () => {
    setMediaUrl(null)
    setMediaPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body.trim(),
          media_url: mediaUrl,
        }),
      })

      if (!response.ok) throw new Error('Failed to create post')
      const newPost = await response.json()
      onPost(newPost.post)

      // Reset form
      setBody('')
      setMediaUrl(null)
      setMediaPreview(null)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-[#EAEAEA] p-5 shadow-sm mb-5"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar src={user.profile_photo_url} name={user.display_name} size="sm" />
        </div>

        {/* Input Area */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={handleTextChange}
            placeholder={`What's on your mind, ${user.display_name}?`}
            rows={2}
            className="w-full resize-none rounded-xl border border-[#EAEAEA] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
          />

          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative mt-3 inline-block">
              <img
                src={mediaPreview}
                alt="Preview"
                className="max-h-40 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Footer: Image Button + Post Button */}
          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#6B6B6B] hover:text-[#E63946] transition-colors"
              aria-label="Upload image"
            >
              <Camera size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="submit"
              disabled={!body.trim() || isSubmitting}
              className="bg-[#E63946] hover:bg-[#c72d3a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2 text-sm font-semibold transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
