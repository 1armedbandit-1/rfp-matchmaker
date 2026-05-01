'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MemberCard } from '@/components/member-card'
import { UserProfile } from '@/types'
import { ROLE_LABELS, DISCIPLINE_LABELS, cn } from '@/lib/utils'
import { ChevronDown, X } from 'lucide-react'

export default function PeoplePage() {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(true)

  // Filters
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [activeOnly, setActiveOnly] = useState(false)

  // Computed states
  const [states, setStates] = useState<string[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])

  const supabase = createClient()

  // Load all users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('users')
          .select(
            `*,
            fighter_profiles(*),
            trainer_profiles(*),
            manager_profiles(*),
            promoter_profiles(*),
            matchmaker_profiles(*),
            provider_profiles(*)`
          )
          .eq('is_profile_complete', true)

        if (error) {
          console.error('Failed to load users:', error)
        } else if (data) {
          setAllUsers(data as UserProfile[])

          // Extract unique states
          const uniqueStates = [...new Set(data.map((u: any) => u.state_region).filter(Boolean))]
          setStates(uniqueStates.sort())
        }
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [supabase])

  // Filter users
  useEffect(() => {
    let result = allUsers

    // Role filter
    if (selectedRoles.length > 0) {
      result = result.filter((u) =>
        selectedRoles.includes(u.primary_role) ||
        (u.secondary_roles && u.secondary_roles.some((r) => selectedRoles.includes(r)))
      )
    }

    // Discipline filter
    if (selectedDisciplines.length > 0) {
      result = result.filter((u) => {
        const userDisciplines: string[] = []
        if (u.fighter_profile?.discipline) userDisciplines.push(...u.fighter_profile.discipline)
        if (u.trainer_profile?.disciplines) userDisciplines.push(...u.trainer_profile.disciplines)
        if (u.manager_profile?.disciplines) userDisciplines.push(...u.manager_profile.disciplines)
        if (u.promoter_profile?.disciplines) userDisciplines.push(...u.promoter_profile.disciplines)
        if (u.matchmaker_profile?.disciplines) userDisciplines.push(...u.matchmaker_profile.disciplines)
        return selectedDisciplines.some((d) => userDisciplines.includes(d))
      })
    }

    // State filter
    if (selectedState) {
      result = result.filter((u) => u.state_region === selectedState)
    }

    // Active fighters only
    if (activeOnly) {
      result = result.filter((u) => u.fighter_profile?.status === 'active')
    }

    setFilteredUsers(result)
  }, [allUsers, selectedRoles, selectedDisciplines, selectedState, activeOnly])

  const hasActiveFilters = selectedRoles.length > 0 || selectedDisciplines.length > 0 || selectedState || activeOnly

  const clearFilters = () => {
    setSelectedRoles([])
    setSelectedDisciplines([])
    setSelectedState('')
    setActiveOnly(false)
  }

  const roles: string[] = ['fighter', 'trainer', 'manager', 'promoter', 'matchmaker', 'provider']
  const disciplines: string[] = ['boxing', 'mma', 'kickboxing', 'muay_thai', 'bjj', 'wrestling']

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Filter Bar */}
      <div className="mb-6">
        {/* Mobile: Collapsible Filter Button */}
        <div className="md:hidden mb-4 flex items-center gap-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#EAEAEA] bg-white hover:bg-gray-50"
          >
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E63946] text-white text-xs font-bold">
                {(selectedRoles.length > 0 ? 1 : 0) +
                  (selectedDisciplines.length > 0 ? 1 : 0) +
                  (selectedState ? 1 : 0) +
                  (activeOnly ? 1 : 0)}
              </span>
            )}
            <ChevronDown size={16} className={cn('transition-transform', filterOpen && 'rotate-180')} />
          </button>
        </div>

        {/* Filter Card */}
        {(filterOpen || window.innerWidth >= 768) && (
          <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm p-5 space-y-4">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() =>
                      setSelectedRoles((prev) =>
                        prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
                      )
                    }
                    className={cn(
                      'px-4 py-2 rounded-full font-medium text-sm transition-all border-2',
                      selectedRoles.includes(role)
                        ? 'bg-[#E63946] text-white border-[#E63946]'
                        : 'bg-white text-gray-700 border-[#EAEAEA] hover:border-[#E63946]'
                    )}
                  >
                    {ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </div>

            {/* Discipline Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Discipline</label>
              <div className="flex flex-wrap gap-2">
                {disciplines.map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setSelectedDisciplines((prev) =>
                        prev.includes(d) ? prev.filter((disc) => disc !== d) : [...prev, d]
                      )
                    }
                    className={cn(
                      'px-4 py-2 rounded-full font-medium text-sm transition-all border-2',
                      selectedDisciplines.includes(d)
                        ? 'bg-[#E63946] text-white border-[#E63946]'
                        : 'bg-white text-gray-700 border-[#EAEAEA] hover:border-[#E63946]'
                    )}
                  >
                    {DISCIPLINE_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">State / Region</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#EAEAEA] bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              >
                <option value="">All Regions</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Fighters Toggle */}
            {selectedRoles.includes('fighter') && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active-only"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#EAEAEA] cursor-pointer accent-[#E63946]"
                />
                <label htmlFor="active-only" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Active Fighters Only
                </label>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-[#EAEAEA]">
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#E63946] hover:text-[#c72d3a] flex items-center gap-1"
                >
                  <X size={14} />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading members...</p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">{filteredUsers.length} members</p>
          </div>

          {/* Grid */}
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <MemberCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm p-8 text-center max-w-md mx-auto">
              <p className="text-gray-600 mb-4">No members match your filters. Try broadening your search.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-xl bg-[#E63946] text-white font-semibold hover:bg-[#c72d3a] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
