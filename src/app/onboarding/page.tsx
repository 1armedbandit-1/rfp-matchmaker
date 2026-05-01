'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/ui/toast'
import { Chip } from '@/components/ui/chip'
import { Avatar } from '@/components/ui/avatar'
import { ROLE_LABELS, DISCIPLINE_LABELS, WEIGHT_CLASS_LABELS, LOOKING_FOR_LABELS } from '@/lib/utils'
import type { UserRole, Discipline, WeightClass, ContactMethod, FighterStatus, AmOrPro, ProviderServiceType } from '@/types/index'

const ROLE_ICONS: Record<string, string> = {
  fighter: '🥊',
  trainer: '💪',
  manager: '📋',
  promoter: '🎤',
  matchmaker: '🤝',
  provider: '🏥',
}

const DISCIPLINES: Discipline[] = ['boxing', 'mma', 'kickboxing', 'muay_thai', 'bjj', 'wrestling']
const WEIGHT_CLASSES: WeightClass[] = [
  'strawweight',
  'flyweight',
  'bantamweight',
  'featherweight',
  'lightweight',
  'welterweight',
  'middleweight',
  'light_heavyweight',
  'heavyweight',
  'super_heavyweight',
]
const SANCTIONING_BODIES = ['USA Boxing', 'ABC', 'NYSAC', 'CSAC', 'ICSF', 'Other']
const CONTACT_METHODS: ContactMethod[] = ['email', 'phone', 'instagram', 'facebook', 'signal', 'whatsapp']
const PROVIDER_SERVICES: ProviderServiceType[] = ['cutman', 'sports_medicine', 'physical_therapy', 'nutrition', 'sports_law', 'sponsorship', 'media', 'other']
const FIGHTER_STATUSES: FighterStatus[] = ['active', 'inactive', 'retired']
const AM_OR_PRO_OPTIONS: AmOrPro[] = ['amateur', 'professional', 'both']

const LOOKING_FOR_BY_ROLE: Record<UserRole, string[]> = {
  fighter: ['fights', 'trainer', 'manager', 'promoter', 'sponsorship', 'sparring_partners', 'gym', 'nutrition', 'sports_medicine'],
  trainer: ['fighters', 'assistant_coaches', 'gym_partnerships'],
  manager: ['fighters', 'co_managers', 'promoter_relationships'],
  promoter: ['fighters', 'matchmakers', 'sponsors', 'venues'],
  matchmaker: ['fighters', 'promoter_relationships'],
  provider: ['clients', 'partnerships'],
}

const ROLES: UserRole[] = ['fighter', 'trainer', 'manager', 'promoter', 'matchmaker', 'provider']

interface OnboardingState {
  primaryRole: UserRole | null
  photoUrl: string | null
  displayName: string
  city: string
  stateRegion: string
  country: string
  shortBio: string
  preferredContactMethod: ContactMethod | null
  preferredContactValue: string
  // Fighter specific
  fighterDisciplines: Discipline[]
  fighterStatus: FighterStatus | null
  fighterAmOrPro: AmOrPro | null
  fighterWeightLbs: string
  fighterWeightClass: WeightClass | null
  fighterProRecordW: string
  fighterProRecordL: string
  fighterProRecordD: string
  fighterProRecordKos: string
  fighterAmRecordW: string
  fighterAmRecordL: string
  fighterAmRecordD: string
  fighterGymAffiliation: string
  fighterBoxRecUrl: string
  fighterTapologyUrl: string
  fighterSherdogUrl: string
  fighterMmaJunkieUrl: string
  fighterOtherRegistryUrl: string
  // Trainer specific
  trainerGymName: string
  trainerGymAddress: string
  trainerDisciplines: Discipline[]
  trainerSpecialties: string
  trainerYearsExperience: string
  trainerAcceptingNewFighters: boolean
  // Manager specific
  managerCompanyName: string
  managerCurrentRosterSize: string
  managerDisciplines: Discipline[]
  // Promoter specific
  promoterOrganizationName: string
  promoterEventsPerYear: string
  promoterDisciplines: Discipline[]
  promoterSanctioningBodies: string[]
  // Matchmaker specific
  matchmakerOrganizations: string[]
  matchmakerDisciplines: Discipline[]
  matchmakerTempOrgInput: string
  // Provider specific
  providerServiceType: ProviderServiceType | null
  providerCredentials: string
  providerServiceAreaRadius: string
  // Looking for
  lookingFor: string[]
}

const INITIAL_STATE: OnboardingState = {
  primaryRole: null,
  photoUrl: null,
  displayName: '',
  city: '',
  stateRegion: '',
  country: 'USA',
  shortBio: '',
  preferredContactMethod: null,
  preferredContactValue: '',
  fighterDisciplines: [],
  fighterStatus: null,
  fighterAmOrPro: null,
  fighterWeightLbs: '',
  fighterWeightClass: null,
  fighterProRecordW: '',
  fighterProRecordL: '',
  fighterProRecordD: '',
  fighterProRecordKos: '',
  fighterAmRecordW: '',
  fighterAmRecordL: '',
  fighterAmRecordD: '',
  fighterGymAffiliation: '',
  fighterBoxRecUrl: '',
  fighterTapologyUrl: '',
  fighterSherdogUrl: '',
  fighterMmaJunkieUrl: '',
  fighterOtherRegistryUrl: '',
  trainerGymName: '',
  trainerGymAddress: '',
  trainerDisciplines: [],
  trainerSpecialties: '',
  trainerYearsExperience: '',
  trainerAcceptingNewFighters: false,
  managerCompanyName: '',
  managerCurrentRosterSize: '',
  managerDisciplines: [],
  promoterOrganizationName: '',
  promoterEventsPerYear: '',
  promoterDisciplines: [],
  promoterSanctioningBodies: [],
  matchmakerOrganizations: [],
  matchmakerDisciplines: [],
  matchmakerTempOrgInput: '',
  providerServiceType: null,
  providerCredentials: '',
  providerServiceAreaRadius: '',
  lookingFor: [],
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(1)
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showRegistryForm, setShowRegistryForm] = useState(false)

  const handleNext = () => {
    if (step === 1 && !state.primaryRole) {
      setToast({ message: 'Please select a role', type: 'error' })
      return
    }
    if (step === 2 && !state.photoUrl) {
      setToast({ message: 'Please upload a profile photo', type: 'error' })
      return
    }
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setToast({ message: 'User not found', type: 'error' })
        return
      }

      const fileName = `avatar.${file.name.split('.').pop()}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        setToast({ message: 'Failed to upload photo', type: 'error' })
        return
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setState((prev) => ({ ...prev, photoUrl: data.publicUrl }))
      setToast({ message: 'Photo uploaded successfully', type: 'success' })
    } catch (error) {
      setToast({ message: 'Error uploading photo', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = async () => {
    try {
      setIsLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setToast({ message: 'User not found', type: 'error' })
        return
      }

      // Upsert main user profile
      const { error: userError } = await supabase.from('users').upsert({
        id: user.id,
        display_name: state.displayName,
        profile_photo_url: state.photoUrl,
        primary_role: state.primaryRole,
        city: state.city || null,
        state_region: state.stateRegion || null,
        country: state.country,
        short_bio: state.shortBio || null,
        preferred_contact_method: state.preferredContactMethod,
        preferred_contact_value: state.preferredContactValue || null,
        is_profile_complete: true,
        updated_at: new Date().toISOString(),
      })

      if (userError) {
        setToast({ message: 'Failed to save profile', type: 'error' })
        return
      }

      // Insert role-specific profile
      if (state.primaryRole === 'fighter') {
        const { error } = await supabase.from('fighter_profiles').upsert({
          user_id: user.id,
          discipline: state.fighterDisciplines,
          status: state.fighterStatus,
          am_or_pro: state.fighterAmOrPro,
          weight_lbs: state.fighterWeightLbs ? parseInt(state.fighterWeightLbs) : null,
          weight_class: state.fighterWeightClass,
          record_pro_w: state.fighterProRecordW ? parseInt(state.fighterProRecordW) : 0,
          record_pro_l: state.fighterProRecordL ? parseInt(state.fighterProRecordL) : 0,
          record_pro_d: state.fighterProRecordD ? parseInt(state.fighterProRecordD) : 0,
          record_pro_kos: state.fighterProRecordKos ? parseInt(state.fighterProRecordKos) : 0,
          record_am_w: state.fighterAmRecordW ? parseInt(state.fighterAmRecordW) : 0,
          record_am_l: state.fighterAmRecordL ? parseInt(state.fighterAmRecordL) : 0,
          record_am_d: state.fighterAmRecordD ? parseInt(state.fighterAmRecordD) : 0,
          boxrec_url: state.fighterBoxRecUrl || null,
          tapology_url: state.fighterTapologyUrl || null,
          sherdog_url: state.fighterSherdogUrl || null,
          mma_junkie_url: state.fighterMmaJunkieUrl || null,
          other_registry_url: state.fighterOtherRegistryUrl || null,
          gym_affiliation: state.fighterGymAffiliation || null,
          looking_for: state.lookingFor,
        })
        if (error) throw error
      } else if (state.primaryRole === 'trainer') {
        const { error } = await supabase.from('trainer_profiles').upsert({
          user_id: user.id,
          gym_name: state.trainerGymName || null,
          gym_address: state.trainerGymAddress || null,
          disciplines: state.trainerDisciplines,
          specialties: state.trainerSpecialties || null,
          years_experience: state.trainerYearsExperience ? parseInt(state.trainerYearsExperience) : null,
          accepting_new_fighters: state.trainerAcceptingNewFighters,
          looking_for: state.lookingFor,
        })
        if (error) throw error
      } else if (state.primaryRole === 'manager') {
        const { error } = await supabase.from('manager_profiles').upsert({
          user_id: user.id,
          company_name: state.managerCompanyName || null,
          current_roster_size: state.managerCurrentRosterSize ? parseInt(state.managerCurrentRosterSize) : null,
          disciplines: state.managerDisciplines,
          looking_for: state.lookingFor,
        })
        if (error) throw error
      } else if (state.primaryRole === 'promoter') {
        const { error } = await supabase.from('promoter_profiles').upsert({
          user_id: user.id,
          organization_name: state.promoterOrganizationName || null,
          events_per_year: state.promoterEventsPerYear ? parseInt(state.promoterEventsPerYear) : null,
          disciplines: state.promoterDisciplines,
          sanctioning_bodies: state.promoterSanctioningBodies,
          looking_for: state.lookingFor,
        })
        if (error) throw error
      } else if (state.primaryRole === 'matchmaker') {
        const { error } = await supabase.from('matchmaker_profiles').upsert({
          user_id: user.id,
          organizations_worked_with: state.matchmakerOrganizations,
          disciplines: state.matchmakerDisciplines,
          looking_for: state.lookingFor,
        })
        if (error) throw error
      } else if (state.primaryRole === 'provider') {
        const { error } = await supabase.from('provider_profiles').upsert({
          user_id: user.id,
          service_type: state.providerServiceType,
          credentials: state.providerCredentials || null,
          service_area_radius_miles: state.providerServiceAreaRadius ? parseInt(state.providerServiceAreaRadius) : null,
          looking_for: state.lookingFor,
        })
        if (error) throw error
      }

      setToast({ message: 'Profile complete! Welcome to the community', type: 'success' })
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Failed to save profile',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = (step / 5) * 100

  return (
    <div className="min-h-screen bg-background-app">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  num <= step ? 'bg-fight-red' : 'bg-border-DEFAULT'
                }`}
              ></div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-sm font-semibold text-text-muted mb-1">Step {step} of 5</h2>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {step === 1 && 'Choose Your Role'}
              {step === 2 && 'Add Your Photo'}
              {step === 3 && 'Your Information'}
              {step === 4 && `Tell us about your ${ROLE_LABELS[state.primaryRole!]?.toLowerCase() || 'profile'}`}
              {step === 5 && 'What are you looking for?'}
            </h1>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-DEFAULT p-6 sm:p-8 mb-6">
          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-text-muted text-center">What best describes you?</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setState((prev) => ({ ...prev, primaryRole: role }))}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      state.primaryRole === role
                        ? 'border-fight-red bg-red-50'
                        : 'border-border-DEFAULT hover:border-fight-red bg-white'
                    }`}
                  >
                    <div className="text-3xl">{ROLE_ICONS[role]}</div>
                    <span className="text-sm font-semibold text-text-primary text-center">
                      {ROLE_LABELS[role]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Photo Upload */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-text-muted text-center">Add your photo</p>
              <div className="flex flex-col items-center gap-4">
                {state.photoUrl && (
                  <Avatar src={state.photoUrl} name={state.displayName || 'User'} size="xl" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-DEFAULT rounded-2xl p-8 w-full max-w-xs text-center hover:border-fight-red transition-colors"
                >
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm font-semibold text-text-primary">Click to upload</p>
                  <p className="text-xs text-text-muted mt-1">PNG, JPG up to 5MB</p>
                </button>
              </div>
              <p className="text-xs text-text-muted text-center">
                Photo is required to complete your profile
              </p>
            </div>
          )}

          {/* STEP 3: Your Info */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={state.displayName}
                  onChange={(e) => setState((prev) => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={state.city}
                    onChange={(e) => setState((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    State/Region
                  </label>
                  <input
                    type="text"
                    value={state.stateRegion}
                    onChange={(e) => setState((prev) => ({ ...prev, stateRegion: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={state.country}
                  onChange={(e) => setState((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Short Bio {state.shortBio.length > 0 && <span className="text-xs text-text-muted">({state.shortBio.length}/500)</span>}
                </label>
                <textarea
                  value={state.shortBio}
                  onChange={(e) => setState((prev) => ({ ...prev, shortBio: e.target.value.slice(0, 500) }))}
                  maxLength={500}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={state.preferredContactMethod || ''}
                  onChange={(e) => setState((prev) => ({ ...prev, preferredContactMethod: e.target.value as ContactMethod }))}
                  className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                >
                  <option value="">Select a method</option>
                  {CONTACT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {state.preferredContactMethod && (
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    {state.preferredContactMethod === 'email' && 'Your email'}
                    {state.preferredContactMethod === 'phone' && 'Your phone number'}
                    {state.preferredContactMethod === 'instagram' && 'Your Instagram handle'}
                    {state.preferredContactMethod === 'facebook' && 'Your Facebook URL'}
                    {state.preferredContactMethod === 'signal' && 'Your Signal number'}
                    {state.preferredContactMethod === 'whatsapp' && 'Your WhatsApp number'}
                  </label>
                  <input
                    type="text"
                    value={state.preferredContactValue}
                    onChange={(e) => setState((prev) => ({ ...prev, preferredContactValue: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Role-Specific Info */}
          {step === 4 && (
            <div className="space-y-4">
              {/* FIGHTER */}
              {state.primaryRole === 'fighter' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Discipline
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DISCIPLINES.map((discipline) => (
                        <Chip
                          key={discipline}
                          label={DISCIPLINE_LABELS[discipline]}
                          selected={state.fighterDisciplines.includes(discipline)}
                          onClick={() => {
                            if (state.fighterDisciplines.includes(discipline)) {
                              setState((prev) => ({
                                ...prev,
                                fighterDisciplines: prev.fighterDisciplines.filter((d) => d !== discipline),
                              }))
                            } else {
                              setState((prev) => ({
                                ...prev,
                                fighterDisciplines: [...prev.fighterDisciplines, discipline],
                              }))
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Status
                    </label>
                    <div className="flex gap-2">
                      {FIGHTER_STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => setState((prev) => ({ ...prev, fighterStatus: status }))}
                          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                            state.fighterStatus === status
                              ? 'bg-fight-red text-white'
                              : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Amateur or Pro
                    </label>
                    <div className="flex gap-2">
                      {AM_OR_PRO_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => setState((prev) => ({ ...prev, fighterAmOrPro: option }))}
                          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                            state.fighterAmOrPro === option
                              ? 'bg-fight-red text-white'
                              : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        value={state.fighterWeightLbs}
                        onChange={(e) => setState((prev) => ({ ...prev, fighterWeightLbs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">
                        Weight Class
                      </label>
                      <select
                        value={state.fighterWeightClass || ''}
                        onChange={(e) => setState((prev) => ({ ...prev, fighterWeightClass: e.target.value as WeightClass }))}
                        className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                      >
                        <option value="">Select weight class</option>
                        {WEIGHT_CLASSES.map((wc) => (
                          <option key={wc} value={wc}>
                            {WEIGHT_CLASS_LABELS[wc]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Professional Record
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-xs text-text-muted">Wins</label>
                        <input
                          type="number"
                          value={state.fighterProRecordW}
                          onChange={(e) => setState((prev) => ({ ...prev, fighterProRecordW: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Losses</label>
                        <input
                          type="number"
                          value={state.fighterProRecordL}
                          onChange={(e) => setState((prev) => ({ ...prev, fighterProRecordL: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Draws</label>
                        <input
                          type="number"
                          value={state.fighterProRecordD}
                          onChange={(e) => setState((prev) => ({ ...prev, fighterProRecordD: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">KOs</label>
                        <input
                          type="number"
                          value={state.fighterProRecordKos}
                          onChange={(e) => setState((prev) => ({ ...prev, fighterProRecordKos: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Amateur Record
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-text-muted">Wins</label>
                        <input
                          type="number"
                          value={state.fighterAmRecordW}
                          onChange={(e) => setState((prev) => ({ ...prev, fighterAmRecordW: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Losses</label>
                        <input
                          type="number"
                          value={state.fighterAmRecordL}
                          onChange={(e) => setState((prev) => ({ ...prev, fighterAmRecordL: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Draws</label>
                        <input
                          type="number"
                          value={state.fighterAmRecordD}
                          onChange={(e) => setState((prev) => ({ ...prev, fighterAmRecordD: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Gym Affiliation
                    </label>
                    <input
                      type="text"
                      value={state.fighterGymAffiliation}
                      onChange={(e) => setState((prev) => ({ ...prev, fighterGymAffiliation: e.target.value }))}
                      placeholder="(Optional)"
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowRegistryForm(!showRegistryForm)}
                      className="text-fight-red hover:text-red-700 font-semibold text-sm"
                    >
                      {showRegistryForm ? '- Hide Registry Links' : '+ Add your records (BoxRec, Tapology, etc.)'}
                    </button>
                    {showRegistryForm && (
                      <div className="mt-4 space-y-3 pt-4 border-t border-border-DEFAULT">
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            BoxRec URL
                          </label>
                          <input
                            type="url"
                            value={state.fighterBoxRecUrl}
                            onChange={(e) => setState((prev) => ({ ...prev, fighterBoxRecUrl: e.target.value }))}
                            placeholder="https://boxrec.com/..."
                            className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-sm focus:outline-none focus:border-fight-red"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            Tapology URL
                          </label>
                          <input
                            type="url"
                            value={state.fighterTapologyUrl}
                            onChange={(e) => setState((prev) => ({ ...prev, fighterTapologyUrl: e.target.value }))}
                            placeholder="https://tapology.com/..."
                            className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-sm focus:outline-none focus:border-fight-red"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            Sherdog URL
                          </label>
                          <input
                            type="url"
                            value={state.fighterSherdogUrl}
                            onChange={(e) => setState((prev) => ({ ...prev, fighterSherdogUrl: e.target.value }))}
                            placeholder="https://sherdog.com/..."
                            className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-sm focus:outline-none focus:border-fight-red"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            MMA Junkie URL
                          </label>
                          <input
                            type="url"
                            value={state.fighterMmaJunkieUrl}
                            onChange={(e) => setState((prev) => ({ ...prev, fighterMmaJunkieUrl: e.target.value }))}
                            placeholder="https://mmajunkie.usatoday.com/..."
                            className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-sm focus:outline-none focus:border-fight-red"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            Other Registry URL
                          </label>
                          <input
                            type="url"
                            value={state.fighterOtherRegistryUrl}
                            onChange={(e) => setState((prev) => ({ ...prev, fighterOtherRegistryUrl: e.target.value }))}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-lg border border-border-DEFAULT text-sm focus:outline-none focus:border-fight-red"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TRAINER */}
              {state.primaryRole === 'trainer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Gym Name
                    </label>
                    <input
                      type="text"
                      value={state.trainerGymName}
                      onChange={(e) => setState((prev) => ({ ...prev, trainerGymName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Gym Address
                    </label>
                    <input
                      type="text"
                      value={state.trainerGymAddress}
                      onChange={(e) => setState((prev) => ({ ...prev, trainerGymAddress: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Disciplines
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DISCIPLINES.map((discipline) => (
                        <Chip
                          key={discipline}
                          label={DISCIPLINE_LABELS[discipline]}
                          selected={state.trainerDisciplines.includes(discipline)}
                          onClick={() => {
                            if (state.trainerDisciplines.includes(discipline)) {
                              setState((prev) => ({
                                ...prev,
                                trainerDisciplines: prev.trainerDisciplines.filter((d) => d !== discipline),
                              }))
                            } else {
                              setState((prev) => ({
                                ...prev,
                                trainerDisciplines: [...prev.trainerDisciplines, discipline],
                              }))
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Specialties
                    </label>
                    <textarea
                      value={state.trainerSpecialties}
                      onChange={(e) => setState((prev) => ({ ...prev, trainerSpecialties: e.target.value }))}
                      placeholder="What are your specialties?"
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={state.trainerYearsExperience}
                      onChange={(e) => setState((prev) => ({ ...prev, trainerYearsExperience: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="accepting"
                      checked={state.trainerAcceptingNewFighters}
                      onChange={(e) => setState((prev) => ({ ...prev, trainerAcceptingNewFighters: e.target.checked }))}
                      className="w-5 h-5 rounded border-border-DEFAULT accent-fight-red"
                    />
                    <label htmlFor="accepting" className="text-sm font-semibold text-text-primary">
                      I'm accepting new fighters
                    </label>
                  </div>
                </div>
              )}

              {/* MANAGER */}
              {state.primaryRole === 'manager' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={state.managerCompanyName}
                      onChange={(e) => setState((prev) => ({ ...prev, managerCompanyName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Current Roster Size
                    </label>
                    <input
                      type="number"
                      value={state.managerCurrentRosterSize}
                      onChange={(e) => setState((prev) => ({ ...prev, managerCurrentRosterSize: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Disciplines
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DISCIPLINES.map((discipline) => (
                        <Chip
                          key={discipline}
                          label={DISCIPLINE_LABELS[discipline]}
                          selected={state.managerDisciplines.includes(discipline)}
                          onClick={() => {
                            if (state.managerDisciplines.includes(discipline)) {
                              setState((prev) => ({
                                ...prev,
                                managerDisciplines: prev.managerDisciplines.filter((d) => d !== discipline),
                              }))
                            } else {
                              setState((prev) => ({
                                ...prev,
                                managerDisciplines: [...prev.managerDisciplines, discipline],
                              }))
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PROMOTER */}
              {state.primaryRole === 'promoter' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={state.promoterOrganizationName}
                      onChange={(e) => setState((prev) => ({ ...prev, promoterOrganizationName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Events Per Year
                    </label>
                    <input
                      type="number"
                      value={state.promoterEventsPerYear}
                      onChange={(e) => setState((prev) => ({ ...prev, promoterEventsPerYear: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Disciplines
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DISCIPLINES.map((discipline) => (
                        <Chip
                          key={discipline}
                          label={DISCIPLINE_LABELS[discipline]}
                          selected={state.promoterDisciplines.includes(discipline)}
                          onClick={() => {
                            if (state.promoterDisciplines.includes(discipline)) {
                              setState((prev) => ({
                                ...prev,
                                promoterDisciplines: prev.promoterDisciplines.filter((d) => d !== discipline),
                              }))
                            } else {
                              setState((prev) => ({
                                ...prev,
                                promoterDisciplines: [...prev.promoterDisciplines, discipline],
                              }))
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Sanctioning Bodies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SANCTIONING_BODIES.map((body) => (
                        <Chip
                          key={body}
                          label={body}
                          selected={state.promoterSanctioningBodies.includes(body)}
                          onClick={() => {
                            if (state.promoterSanctioningBodies.includes(body)) {
                              setState((prev) => ({
                                ...prev,
                                promoterSanctioningBodies: prev.promoterSanctioningBodies.filter((b) => b !== body),
                              }))
                            } else {
                              setState((prev) => ({
                                ...prev,
                                promoterSanctioningBodies: [...prev.promoterSanctioningBodies, body],
                              }))
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MATCHMAKER */}
              {state.primaryRole === 'matchmaker' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Organizations You've Worked With
                    </label>
                    <div className="space-y-2">
                      {state.matchmakerOrganizations.map((org, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex-1 px-4 py-2 rounded-lg bg-gray-50 text-text-primary text-sm">
                            {org}
                          </div>
                          <button
                            onClick={() => {
                              setState((prev) => ({
                                ...prev,
                                matchmakerOrganizations: prev.matchmakerOrganizations.filter((_, i) => i !== idx),
                              }))
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={state.matchmakerTempOrgInput}
                        onChange={(e) => setState((prev) => ({ ...prev, matchmakerTempOrgInput: e.target.value }))}
                        placeholder="Enter organization name"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && state.matchmakerTempOrgInput.trim()) {
                            setState((prev) => ({
                              ...prev,
                              matchmakerOrganizations: [...prev.matchmakerOrganizations, prev.matchmakerTempOrgInput.trim()],
                              matchmakerTempOrgInput: '',
                            }))
                          }
                        }}
                        className="flex-1 px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (state.matchmakerTempOrgInput.trim()) {
                            setState((prev) => ({
                              ...prev,
                              matchmakerOrganizations: [...prev.matchmakerOrganizations, prev.matchmakerTempOrgInput.trim()],
                              matchmakerTempOrgInput: '',
                            }))
                          }
                        }}
                        className="px-4 py-3 bg-fight-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Disciplines
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DISCIPLINES.map((discipline) => (
                        <Chip
                          key={discipline}
                          label={DISCIPLINE_LABELS[discipline]}
                          selected={state.matchmakerDisciplines.includes(discipline)}
                          onClick={() => {
                            if (state.matchmakerDisciplines.includes(discipline)) {
                              setState((prev) => ({
                                ...prev,
                                matchmakerDisciplines: prev.matchmakerDisciplines.filter((d) => d !== discipline),
                              }))
                            } else {
                              setState((prev) => ({
                                ...prev,
                                matchmakerDisciplines: [...prev.matchmakerDisciplines, discipline],
                              }))
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PROVIDER */}
              {state.primaryRole === 'provider' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Service Type
                    </label>
                    <select
                      value={state.providerServiceType || ''}
                      onChange={(e) => setState((prev) => ({ ...prev, providerServiceType: e.target.value as ProviderServiceType }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    >
                      <option value="">Select service type</option>
                      {PROVIDER_SERVICES.map((service) => (
                        <option key={service} value={service}>
                          {service.replace(/_/g, ' ').charAt(0).toUpperCase() + service.replace(/_/g, ' ').slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Credentials
                    </label>
                    <textarea
                      value={state.providerCredentials}
                      onChange={(e) => setState((prev) => ({ ...prev, providerCredentials: e.target.value }))}
                      placeholder="Your credentials, certifications, experience..."
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Service Area Radius (miles)
                    </label>
                    <input
                      type="number"
                      value={state.providerServiceAreaRadius}
                      onChange={(e) => setState((prev) => ({ ...prev, providerServiceAreaRadius: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Looking For */}
          {step === 5 && (
            <div className="space-y-6">
              <p className="text-text-muted text-center">What brings you to the community?</p>
              {state.primaryRole && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {LOOKING_FOR_BY_ROLE[state.primaryRole].map((item) => (
                    <Chip
                      key={item}
                      label={LOOKING_FOR_LABELS[item] || item}
                      selected={state.lookingFor.includes(item)}
                      onClick={() => {
                        if (state.lookingFor.includes(item)) {
                          setState((prev) => ({
                            ...prev,
                            lookingFor: prev.lookingFor.filter((x) => x !== item),
                          }))
                        } else {
                          setState((prev) => ({
                            ...prev,
                            lookingFor: [...prev.lookingFor, item],
                          }))
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 font-semibold text-text-primary border-2 border-border-DEFAULT rounded-xl hover:border-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          {step === 5 ? (
            <button
              onClick={handleFinish}
              disabled={isLoading}
              className="px-6 py-3 font-semibold text-white bg-fight-red rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Finishing...' : 'Finish'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 font-semibold text-white bg-fight-red rounded-xl hover:bg-red-700 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
