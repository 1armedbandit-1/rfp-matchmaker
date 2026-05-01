'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { RoleBadge } from '@/components/ui/role-badge'
import { UserProfile } from '@/types'
import { DISCIPLINE_LABELS, LOOKING_FOR_LABELS, cn } from '@/lib/utils'

interface MemberCardProps {
  user: UserProfile
}

export function MemberCard({ user }: MemberCardProps) {
  // Get disciplines from role-specific profiles
  const getDisciplines = (): string[] => {
    const disciplines: string[] = []
    if (user.fighter_profile?.discipline) disciplines.push(...user.fighter_profile.discipline)
    if (user.trainer_profile?.disciplines) disciplines.push(...user.trainer_profile.disciplines)
    if (user.manager_profile?.disciplines) disciplines.push(...user.manager_profile.disciplines)
    if (user.promoter_profile?.disciplines) disciplines.push(...user.promoter_profile.disciplines)
    if (user.matchmaker_profile?.disciplines) disciplines.push(...user.matchmaker_profile.disciplines)
    return [...new Set(disciplines)]
  }

  // Get looking for from all role profiles
  const getLookingFor = (): string[] => {
    const lookingFor: string[] = []
    if (user.fighter_profile?.looking_for) lookingFor.push(...user.fighter_profile.looking_for)
    if (user.trainer_profile?.looking_for) lookingFor.push(...user.trainer_profile.looking_for)
    if (user.manager_profile?.looking_for) lookingFor.push(...user.manager_profile.looking_for)
    if (user.promoter_profile?.looking_for) lookingFor.push(...user.promoter_profile.looking_for)
    if (user.matchmaker_profile?.looking_for) lookingFor.push(...user.matchmaker_profile.looking_for)
    if (user.provider_profile?.looking_for) lookingFor.push(...user.provider_profile.looking_for)
    return [...new Set(lookingFor)]
  }

  const disciplines = getDisciplines()
  const lookingFor = getLookingFor()
  const location = [user.city, user.state_region].filter(Boolean).join(', ')

  const visibleDisciplines = disciplines.slice(0, 3)
  const hiddenDisciplinesCount = Math.max(0, disciplines.length - 3)

  const visibleLooking = lookingFor.slice(0, 3)
  const hiddenLookingCount = Math.max(0, lookingFor.length - 3)

  return (
    <Link href={`/profile/${user.id}`}>
      <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer p-5 h-full flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="mb-3">
          <Avatar src={user.profile_photo_url} name={user.display_name} size="lg" />
        </div>

        {/* Name */}
        <h3 className="font-semibold text-base mb-1 line-clamp-2">{user.display_name}</h3>

        {/* Role Badge */}
        <div className="mb-2">
          <RoleBadge role={user.primary_role} />
        </div>

        {/* Location */}
        {location && <p className="text-xs text-gray-500 mb-4">{location}</p>}

        {/* Disciplines */}
        {disciplines.length > 0 && (
          <div className="mb-3 w-full">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {visibleDisciplines.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {DISCIPLINE_LABELS[d] || d}
                </span>
              ))}
              {hiddenDisciplinesCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  +{hiddenDisciplinesCount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Looking For */}
        {lookingFor.length > 0 && (
          <div className="w-full">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {visibleLooking.map((l) => (
                <span
                  key={l}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium border',
                    'border-[#E63946] text-[#E63946] bg-white'
                  )}
                >
                  {LOOKING_FOR_LABELS[l] || l}
                </span>
              ))}
              {hiddenLookingCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-[#E63946] text-[#E63946] bg-white">
                  +{hiddenLookingCount}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
