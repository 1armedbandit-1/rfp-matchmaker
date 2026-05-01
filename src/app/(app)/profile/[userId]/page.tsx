// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Avatar from '@/components/ui/avatar'
import RoleBadge from '@/components/ui/role-badge'
import Chip from '@/components/ui/chip'
import PostCard from '@/components/post-card'
import ContactModal from '@/components/contact-modal'
import {
  ROLE_LABELS,
  DISCIPLINE_LABELS,
  LOOKING_FOR_LABELS,
  WEIGHT_CLASS_LABELS,
  formatRecord,
} from '@/lib/utils'
import { ExternalLink, MapPin, Calendar } from 'lucide-react'
import { UserProfile } from '@/types'

interface ProfilePageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="rounded-2xl bg-white border border-[#EAEAEA] p-8 text-center">
          <p className="text-[#6B6B6B]">User not found</p>
        </div>
      </div>
    )
  }

  // Fetch role-specific profile
  let fighterProfile = null
  let trainerProfile = null
  let managerProfile = null
  let promoterProfile = null
  let matchmakerProfile = null
  let providerProfile = null

  if (userProfile.primary_role === 'fighter') {
    const { data } = await supabase
      .from('fighter_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    fighterProfile = data
  } else if (userProfile.primary_role === 'trainer') {
    const { data } = await supabase
      .from('trainer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    trainerProfile = data
  } else if (userProfile.primary_role === 'manager') {
    const { data } = await supabase
      .from('manager_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    managerProfile = data
  } else if (userProfile.primary_role === 'promoter') {
    const { data } = await supabase
      .from('promoter_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    promoterProfile = data
  } else if (userProfile.primary_role === 'matchmaker') {
    const { data } = await supabase
      .from('matchmaker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    matchmakerProfile = data
  } else if (userProfile.primary_role === 'provider') {
    const { data } = await supabase
      .from('provider_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    providerProfile = data
  }

  // Fetch recent posts by this user
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
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const memberSince = new Date(userProfile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="bg-[#FAFAF7] min-h-screen pb-12">
      {/* Hero Band */}
      <div className="bg-gradient-to-b from-[#FAFAF7] to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-4 mb-6">
            <Avatar
              src={userProfile.profile_photo_url}
              name={userProfile.display_name}
              size="lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A1A]">
                {userProfile.display_name}
              </h1>
              <div className="mt-2">
                <RoleBadge role={userProfile.primary_role} />
              </div>
              <p className="text-sm text-[#6B6B6B] mt-2 flex items-center justify-center gap-1">
                {userProfile.city && userProfile.state_region && (
                  <>
                    <MapPin size={16} />
                    {userProfile.city}, {userProfile.state_region}
                  </>
                )}
              </p>
              <p className="text-xs text-[#6B6B6B] mt-1 flex items-center justify-center gap-1">
                <Calendar size={14} />
                Member since {memberSince}
              </p>
            </div>

            {/* Contact Info Button */}
            {userProfile.preferred_contact_method && (
              <ContactModal user={userProfile} />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Bio Section */}
        {userProfile.short_bio && (
          <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm">
            <h2 className="font-bold text-lg text-[#1A1A1A] mb-3">About</h2>
            <p className="text-sm text-[#1A1A1A] leading-relaxed">
              {userProfile.short_bio}
            </p>
          </div>
        )}

        {/* Role-Specific Data */}
        {fighterProfile && (
          <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-[#1A1A1A]">Fighting Record</h2>

            {/* Pro Record */}
            {(fighterProfile.record_pro_w ||
              fighterProfile.record_pro_l ||
              fighterProfile.record_pro_d) && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                  Pro Record
                </p>
                <p className="text-3xl font-bold text-[#E63946]">
                  {formatRecord(
                    fighterProfile.record_pro_w,
                    fighterProfile.record_pro_l,
                    fighterProfile.record_pro_d,
                    fighterProfile.record_pro_kos
                  )}
                </p>
              </div>
            )}

            {/* Amateur Record */}
            {(fighterProfile.record_am_w ||
              fighterProfile.record_am_l ||
              fighterProfile.record_am_d) && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                  Amateur Record
                </p>
                <p className="text-xl font-semibold text-[#1A1A1A]">
                  {formatRecord(
                    fighterProfile.record_am_w,
                    fighterProfile.record_am_l,
                    fighterProfile.record_am_d
                  )}
                </p>
              </div>
            )}

            {/* Weight Class & Disciplines */}
            <div className="pt-4 border-t border-[#EAEAEA]">
              <div className="space-y-3">
                {fighterProfile.weight_class && (
                  <div>
                    <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                      Weight Class
                    </p>
                    <Chip>
                      {WEIGHT_CLASS_LABELS[fighterProfile.weight_class]}
                    </Chip>
                  </div>
                )}

                {fighterProfile.discipline && fighterProfile.discipline.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                      Disciplines
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fighterProfile.discipline.map((d) => (
                        <Chip key={d}>{DISCIPLINE_LABELS[d]}</Chip>
                      ))}
                    </div>
                  </div>
                )}

                {fighterProfile.gym_affiliation && (
                  <div>
                    <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                      Gym
                    </p>
                    <p className="text-sm text-[#1A1A1A]">
                      {fighterProfile.gym_affiliation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Registry Links */}
            {(fighterProfile.boxrec_url ||
              fighterProfile.tapology_url ||
              fighterProfile.sherdog_url ||
              fighterProfile.mma_junkie_url ||
              fighterProfile.other_registry_url) && (
              <div className="pt-4 border-t border-[#EAEAEA]">
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-3">
                  Registry Links
                </p>
                <div className="flex flex-wrap gap-2">
                  {fighterProfile.boxrec_url && (
                    <a
                      href={fighterProfile.boxrec_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs border border-[#EAEAEA] hover:border-[#E63946] rounded-lg px-3 py-2 text-[#1A1A1A] transition-colors"
                    >
                      BoxRec <ExternalLink size={12} />
                    </a>
                  )}
                  {fighterProfile.tapology_url && (
                    <a
                      href={fighterProfile.tapology_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs border border-[#EAEAEA] hover:border-[#E63946] rounded-lg px-3 py-2 text-[#1A1A1A] transition-colors"
                    >
                      Tapology <ExternalLink size={12} />
                    </a>
                  )}
                  {fighterProfile.sherdog_url && (
                    <a
                      href={fighterProfile.sherdog_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs border border-[#EAEAEA] hover:border-[#E63946] rounded-lg px-3 py-2 text-[#1A1A1A] transition-colors"
                    >
                      Sherdog <ExternalLink size={12} />
                    </a>
                  )}
                  {fighterProfile.mma_junkie_url && (
                    <a
                      href={fighterProfile.mma_junkie_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs border border-[#EAEAEA] hover:border-[#E63946] rounded-lg px-3 py-2 text-[#1A1A1A] transition-colors"
                    >
                      MMA Junkie <ExternalLink size={12} />
                    </a>
                  )}
                  {fighterProfile.other_registry_url && (
                    <a
                      href={fighterProfile.other_registry_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs border border-[#EAEAEA] hover:border-[#E63946] rounded-lg px-3 py-2 text-[#1A1A1A] transition-colors"
                    >
                      Other Registry <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {trainerProfile && (
          <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-[#1A1A1A]">Coaching Details</h2>

            {trainerProfile.gym_name && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Gym
                </p>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {trainerProfile.gym_name}
                </p>
                {trainerProfile.gym_address && (
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    {trainerProfile.gym_address}
                  </p>
                )}
              </div>
            )}

            {trainerProfile.disciplines && trainerProfile.disciplines.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                  Disciplines
                </p>
                <div className="flex flex-wrap gap-2">
                  {trainerProfile.disciplines.map((d) => (
                    <Chip key={d}>{DISCIPLINE_LABELS[d]}</Chip>
                  ))}
                </div>
              </div>
            )}

            {trainerProfile.years_experience !== null && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Experience
                </p>
                <p className="text-sm text-[#1A1A1A]">
                  {trainerProfile.years_experience} years
                </p>
              </div>
            )}

            {trainerProfile.accepting_new_fighters && (
              <div className="pt-2 border-t border-[#EAEAEA]">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Accepting New Fighters
                </span>
              </div>
            )}
          </div>
        )}

        {managerProfile && (
          <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-[#1A1A1A]">Management</h2>

            {managerProfile.company_name && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Company
                </p>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {managerProfile.company_name}
                </p>
              </div>
            )}

            {managerProfile.current_roster_size !== null && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Roster Size
                </p>
                <p className="text-sm text-[#1A1A1A]">
                  {managerProfile.current_roster_size} fighters
                </p>
              </div>
            )}

            {managerProfile.disciplines && managerProfile.disciplines.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                  Disciplines
                </p>
                <div className="flex flex-wrap gap-2">
                  {managerProfile.disciplines.map((d) => (
                    <Chip key={d}>{DISCIPLINE_LABELS[d]}</Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {promoterProfile && (
          <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-[#1A1A1A]">Promotion</h2>

            {promoterProfile.organization_name && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Organization
                </p>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {promoterProfile.organization_name}
                </p>
              </div>
            )}

            {promoterProfile.events_per_year !== null && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Events Per Year
                </p>
                <p className="text-sm text-[#1A1A1A]">
                  {promoterProfile.events_per_year} events
                </p>
              </div>
            )}

            {promoterProfile.disciplines && promoterProfile.disciplines.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                  Disciplines
                </p>
                <div className="flex flex-wrap gap-2">
                  {promoterProfile.disciplines.map((d) => (
                    <Chip key={d}>{DISCIPLINE_LABELS[d]}</Chip>
                  ))}
                </div>
              </div>
            )}

            {promoterProfile.sanctioning_bodies &&
              promoterProfile.sanctioning_bodies.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                    Sanctioning Bodies
                  </p>
                  <p className="text-sm text-[#1A1A1A]">
                    {promoterProfile.sanctioning_bodies.join(', ')}
                  </p>
                </div>
              )}
          </div>
        )}

        {matchmakerProfile && (
          <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-[#1A1A1A]">Matchmaking</h2>

            {matchmakerProfile.organizations_worked_with &&
              matchmakerProfile.organizations_worked_with.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                    Organizations
                  </p>
                  <p className="text-sm text-[#1A1A1A]">
                    {matchmakerProfile.organizations_worked_with.join(', ')}
                  </p>
                </div>
              )}

            {matchmakerProfile.disciplines &&
              matchmakerProfile.disciplines.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-2">
                    Disciplines
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {matchmakerProfile.disciplines.map((d) => (
                      <Chip key={d}>{DISCIPLINE_LABELS[d]}</Chip>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {providerProfile && (
          <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-[#1A1A1A]">Service Details</h2>

            <div>
              <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                Service Type
              </p>
              <p className="text-sm text-[#1A1A1A]">
                {providerProfile.service_type}
              </p>
            </div>

            {providerProfile.credentials && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Credentials
                </p>
                <p className="text-sm text-[#1A1A1A]">
                  {providerProfile.credentials}
                </p>
              </div>
            )}

            {providerProfile.service_area_radius_miles !== null && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase mb-1">
                  Service Area
                </p>
                <p className="text-sm text-[#1A1A1A]">
                  {providerProfile.service_area_radius_miles} miles
                </p>
              </div>
            )}
          </div>
        )}

        {/* Looking For Section */}
        {(() => {
          let lookingFor: string[] = []
          if (fighterProfile?.looking_for) lookingFor = fighterProfile.looking_for
          else if (trainerProfile?.looking_for) lookingFor = trainerProfile.looking_for
          else if (managerProfile?.looking_for) lookingFor = managerProfile.looking_for
          else if (promoterProfile?.looking_for) lookingFor = promoterProfile.looking_for
          else if (matchmakerProfile?.looking_for)
            lookingFor = matchmakerProfile.looking_for
          else if (providerProfile?.looking_for) lookingFor = providerProfile.looking_for

          return (
            lookingFor.length > 0 && (
              <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm">
                <h2 className="font-bold text-lg text-[#1A1A1A] mb-3">
                  What I'm Looking For
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lookingFor.map((item) => (
                    <Chip key={item} variant="secondary">
                      {LOOKING_FOR_LABELS[item]}
                    </Chip>
                  ))}
                </div>
              </div>
            )
          )
        })()}

        {/* Recent Posts */}
        {postsData && postsData.length > 0 && (
          <div>
            <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">Recent Posts</h2>
            <div className="space-y-4">
              {postsData.map((p: any) => (
                <PostCard
                  key={p.id}
                  post={{
                    id: p.id,
                    user_id: p.user_id,
                    body: p.body,
                    media_url: p.media_url,
                    like_count: p.like_count,
                    comment_count: p.comment_count,
                    created_at: p.created_at,
                    author: p.users as unknown as UserProfile,
                  }}
                  currentUserId={session?.user.id || ''}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
