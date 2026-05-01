import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Avatar from '@/components/ui/avatar'
import RoleBadge from '@/components/ui/role-badge'
import { Users, ArrowRight } from 'lucide-react'
import { UserProfile } from '@/types'

interface SidebarProps {
  currentUserId: string
}

export default async function Sidebar({ currentUserId }: SidebarProps) {
  const supabase = await createClient()

  // Fetch member count
  const { count: memberCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_profile_complete', true)

  // Fetch newest members
  const { data: newestMembers } = await supabase
    .from('users')
    .select('id, display_name, profile_photo_url, primary_role')
    .eq('is_profile_complete', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-5">
      {/* Community Card */}
      <div className="rounded-2xl bg-white border border-[#EAEAEA] p-5 shadow-sm">
        <h3 className="font-bold text-base text-[#1A1A1A] mb-2">
          Welcome to The Real Fight Matchmaker
        </h3>
        <p className="text-sm text-[#6B6B6B] mb-4">
          The home for fighters, trainers, managers, promoters, and everyone who makes combat sports happen.
        </p>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
          <Users size={18} className="text-[#E63946]" />
          <span>{memberCount?.toLocaleString() || 0} members</span>
        </div>
      </div>

      {/* Newest Members */}
      {newestMembers && newestMembers.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#EAEAEA] p-5 shadow-sm">
          <h3 className="font-bold text-sm text-[#1A1A1A] mb-3">Newest Members</h3>
          <div className="space-y-3">
            {newestMembers.map((member: any) => (
              <Link
                key={member.id}
                href={`/profile/${member.id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#FAFAF7] transition-colors group"
              >
                <Avatar
                  src={member.profile_photo_url}
                  name={member.display_name}
                  size="xs"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A1A] truncate group-hover:text-[#E63946]">
                    {member.display_name}
                  </p>
                  <RoleBadge role={member.primary_role} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="space-y-2">
        <Link
          href="/people"
          className="w-full flex items-center justify-center gap-2 border border-[#EAEAEA] hover:border-[#E63946] rounded-xl py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors"
        >
          Browse Members
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/match"
          className="w-full flex items-center justify-center gap-2 border border-[#EAEAEA] hover:border-[#E63946] rounded-xl py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors"
        >
          Find My Match
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
