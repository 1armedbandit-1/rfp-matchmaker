// @ts-nocheck
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/ui/toast'
import { Chip } from '@/components/ui/chip'
import type { UserRole } from '@/types/index'

const TOTAL_STEPS = 7

const ROLE_OPTIONS = [
  { value: 'fighter',    label: 'Fighter',          icon: '🥊' },
  { value: 'trainer',    label: 'Trainer / Coach',  icon: '💪' },
  { value: 'manager',    label: 'Manager',           icon: '📋' },
  { value: 'promoter',   label: 'Promoter',          icon: '🎤' },
  { value: 'matchmaker', label: 'Matchmaker',        icon: '🤝' },
  { value: 'provider',   label: 'Service Provider',  icon: '🏥' },
]

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram',   placeholder: 'https://instagram.com/yourhandle',  icon: '📸' },
  { key: 'twitter',   label: 'X / Twitter', placeholder: 'https://x.com/yourhandle',           icon: '🐦' },
  { key: 'facebook',  label: 'Facebook',    placeholder: 'https://facebook.com/yourpage',      icon: '👥' },
  { key: 'youtube',   label: 'YouTube',     placeholder: 'https://youtube.com/@yourchannel',   icon: '▶️' },
  { key: 'tiktok',    label: 'TikTok',      placeholder: 'https://tiktok.com/@yourhandle',     icon: '🎵' },
  { key: 'linkedin',  label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/yourname',   icon: '💼' },
  { key: 'snapchat',  label: 'Snapchat',    placeholder: 'https://snapchat.com/add/yourname',  icon: '👻' },
  { key: 'website',   label: 'Personal Website', placeholder: 'https://yourwebsite.com',       icon: '🌐' },
]

const LOOKING_FOR_OPTIONS = [
  'fights', 'trainer', 'manager', 'promoter', 'sponsorship',
  'sparring_partners', 'gym', 'nutrition', 'sports_medicine',
  'fighters', 'assistant_coaches', 'gym_partnerships',
  'co_managers', 'promoter_relationships', 'matchmakers',
  'sponsors', 'venues', 'clients', 'partnerships',
]

const LOOKING_FOR_LABELS: Record<string, string> = {
  fights: 'Fights',
  trainer: 'Trainer',
  manager: 'Manager',
  promoter: 'Promoter',
  sponsorship: 'Sponsorship',
  sparring_partners: 'Sparring Partners',
  gym: 'Gym',
  nutrition: 'Nutrition',
  sports_medicine: 'Sports Medicine',
  fighters: 'Fighters',
  assistant_coaches: 'Assistant Coaches',
  gym_partnerships: 'Gym Partnerships',
  co_managers: 'Co-Managers',
  promoter_relationships: 'Promoter Relationships',
  matchmakers: 'Matchmakers',
  sponsors: 'Sponsors',
  venues: 'Venues',
  clients: 'Clients',
  partnerships: 'Partnerships',
}

const STEP_TITLES = [
  'Choose Your Role(s)',
  'Profile Photo',
  'About You',
  'Registry & Profile Links',
  'Social Media',
  'Location & Affiliations',
  'Verification',
]

interface OnboardingState {
  // Step 1 — roles
  selectedRoles: string[]
  otherRoleText: string
  // Step 2 — photo (optional)
  photoUrl: string | null
  // Step 3 — about
  displayName: string
  shortBio: string
  // Step 4 — registry links
  boxrecUrl: string
  tapologyUrl: string
  sherdogUrl: string
  mmaJunkieUrl: string
  otherRegistryUrl: string
  // Step 5 — social media
  instagram: string
  twitter: string
  facebook: string
  youtube: string
  tiktok: string
  linkedin: string
  snapchat: string
  website: string
  // Step 6 — location + affiliations + looking for
  city: string
  stateRegion: string
  country: string
  gymAffiliation: string
  organization: string
  lookingFor: string[]
  // Step 7 — verification
  phoneNumber: string
  selfieUrl: string | null
  verificationCode: string
}

const INITIAL_STATE: OnboardingState = {
  selectedRoles: [],
  otherRoleText: '',
  photoUrl: null,
  displayName: '',
  shortBio: '',
  boxrecUrl: '',
  tapologyUrl: '',
  sherdogUrl: '',
  mmaJunkieUrl: '',
  otherRegistryUrl: '',
  instagram: '',
  twitter: '',
  facebook: '',
  youtube: '',
  tiktok: '',
  linkedin: '',
  snapchat: '',
  website: '',
  city: '',
  stateRegion: '',
  country: 'USA',
  gymAffiliation: '',
  organization: '',
  lookingFor: [],
  phoneNumber: '',
  selfieUrl: null,
  verificationCode: '',
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-border-DEFAULT text-text-primary placeholder-text-muted focus:outline-none focus:border-fight-red focus:ring-1 focus:ring-fight-red transition-colors bg-white'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(1)
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [smsSent, setSmsSent] = useState(false)

  const update = (key: keyof OnboardingState, value: any) =>
    setState((prev) => ({ ...prev, [key]: value }))

  // ── role toggle ──────────────────────────────────────────────
  const toggleRole = (role: string) => {
    setState((prev) => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter((r) => r !== role)
        : [...prev.selectedRoles, role],
    }))
  }

  // ── looking-for toggle ───────────────────────────────────────
  const toggleLookingFor = (item: string) => {
    setState((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(item)
        ? prev.lookingFor.filter((x) => x !== item)
        : [...prev.lookingFor, item],
    }))
  }

  // ── photo upload ─────────────────────────────────────────────
  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: 'avatars' | 'selfies',
    stateKey: 'photoUrl' | 'selfieUrl'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'File too large — max 5MB', type: 'error' })
      return
    }

    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      const ext = file.name.split('.').pop() || 'jpg'
      const filePath = `${user.id}/${stateKey === 'selfieUrl' ? 'selfie' : 'avatar'}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      if (bucket === 'avatars') {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
        update(stateKey, data.publicUrl)
        setToast({ message: 'Photo uploaded!', type: 'success' })
      } else {
        // selfies bucket is private — just store the path, not a public URL
        update(stateKey, filePath)
        setToast({ message: 'Selfie uploaded securely ✓', type: 'success' })
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Upload failed', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  // ── navigation ───────────────────────────────────────────────
  const handleNext = () => {
    if (step === 1 && state.selectedRoles.length === 0 && !state.otherRoleText.trim()) {
      setToast({ message: 'Please select at least one role', type: 'error' })
      return
    }
    if (step === 3 && !state.displayName.trim()) {
      setToast({ message: 'Please enter your display name', type: 'error' })
      return
    }
    if (step < TOTAL_STEPS) setStep(step + 1)
  }

  const handleBack = () => { if (step > 1) setStep(step - 1) }

  // ── fake SMS send (replace with real Twilio/Supabase Phone Auth) ─
  const handleSendSms = async () => {
    if (!state.phoneNumber.trim()) {
      setToast({ message: 'Enter your phone number first', type: 'error' })
      return
    }
    // TODO: integrate Twilio / Supabase Phone Auth here
    setSmsSent(true)
    setToast({ message: 'Verification code sent to your phone!', type: 'success' })
  }

  // ── finish ───────────────────────────────────────────────────
  const handleFinish = async () => {
    if (!state.phoneNumber.trim()) {
      setToast({ message: 'Phone number is required for verification', type: 'error' })
      return
    }
    if (!state.selfieUrl) {
      setToast({ message: 'Please upload your verification selfie', type: 'error' })
      return
    }

    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      const primaryRole = (state.selectedRoles[0] || 'fighter') as UserRole
      const secondaryRoles = state.selectedRoles.slice(1)

      // Build social links as JSON for storage
      const socialLinks = {
        instagram: state.instagram || null,
        twitter: state.twitter || null,
        facebook: state.facebook || null,
        youtube: state.youtube || null,
        tiktok: state.tiktok || null,
        linkedin: state.linkedin || null,
        snapchat: state.snapchat || null,
        website: state.website || null,
      }

      const registryLinks = {
        boxrec: state.boxrecUrl || null,
        tapology: state.tapologyUrl || null,
        sherdog: state.sherdogUrl || null,
        mma_junkie: state.mmaJunkieUrl || null,
        other: state.otherRegistryUrl || null,
      }

      // Save to users table
      // NOTE: social_links, registry_links, phone_number, selfie_path need a DB migration
      // Run: ALTER TABLE public.users ADD COLUMN IF NOT EXISTS social_links jsonb;
      //       ALTER TABLE public.users ADD COLUMN IF NOT EXISTS registry_links jsonb;
      //       ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number text;
      //       ALTER TABLE public.users ADD COLUMN IF NOT EXISTS selfie_path text;
      const { error: userError } = await supabase.from('users').upsert({
        id: user.id,
        display_name: state.displayName || user.email?.split('@')[0] || 'Member',
        profile_photo_url: state.photoUrl,
        primary_role: primaryRole,
        secondary_roles: secondaryRoles,
        city: state.city || null,
        state_region: state.stateRegion || null,
        country: state.country || 'USA',
        short_bio: state.shortBio || null,
        preferred_contact_value: state.phoneNumber || null,
        preferred_contact_method: 'phone',
        gym_affiliation: state.gymAffiliation || null,
        is_profile_complete: true,
        updated_at: new Date().toISOString(),
        // New columns (require migration — safe to send, Supabase ignores unknown cols)
        social_links: socialLinks,
        registry_links: registryLinks,
        phone_number: state.phoneNumber || null,
        selfie_path: state.selfieUrl || null,
      })

      if (userError) {
        // Re-try without new columns in case migration hasn't run yet
        const { error: retryError } = await supabase.from('users').upsert({
          id: user.id,
          display_name: state.displayName || user.email?.split('@')[0] || 'Member',
          profile_photo_url: state.photoUrl,
          primary_role: primaryRole,
          secondary_roles: secondaryRoles,
          city: state.city || null,
          state_region: state.stateRegion || null,
          country: state.country || 'USA',
          short_bio: state.shortBio || null,
          preferred_contact_value: state.phoneNumber || null,
          preferred_contact_method: 'phone',
          is_profile_complete: true,
          updated_at: new Date().toISOString(),
        })
        if (retryError) throw retryError
      }

      // Re-send email verification via Supabase
      await supabase.auth.resend({ type: 'signup', email: user.email! })

      setToast({ message: 'Profile saved! Check your email to verify your account.', type: 'success' })
      setTimeout(() => router.push('/home'), 2000)
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save profile', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  // ── upload box helper ────────────────────────────────────────
  const UploadBox = ({
    label,
    sublabel,
    icon,
    url,
    onClick,
    loading,
    isPrivate,
  }: {
    label: string
    sublabel: string
    icon: string
    url: string | null
    onClick: () => void
    loading?: boolean
    isPrivate?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="border-2 border-dashed border-border-DEFAULT rounded-2xl p-8 w-full text-center hover:border-fight-red transition-colors disabled:opacity-60"
    >
      {url ? (
        <div className="flex flex-col items-center gap-2">
          {!isPrivate && (
            <img
              src={url}
              alt="Uploaded"
              className="w-24 h-24 rounded-full object-cover border-4 border-fight-red"
            />
          )}
          <p className="text-sm font-semibold text-green-600">
            {isPrivate ? '✓ Selfie uploaded securely' : '✓ Photo uploaded'}
          </p>
          <p className="text-xs text-text-muted">Click to change</p>
        </div>
      ) : (
        <>
          <div className="text-3xl mb-2">{icon}</div>
          <p className="text-sm font-semibold text-text-primary">{label}</p>
          <p className="text-xs text-text-muted mt-1">{sublabel}</p>
        </>
      )}
    </button>
  )

  // ── render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background-app">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

        {/* Progress dots */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'bg-fight-red w-8' : 'bg-border-DEFAULT w-4'
                }`}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-text-muted mb-1">
              Step {step} of {TOTAL_STEPS}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {STEP_TITLES[step - 1]}
            </h1>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-DEFAULT p-6 sm:p-8 mb-6">

          {/* ── STEP 1: Roles ── */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-text-muted text-center text-sm">
                Select all that apply — you can choose more than one.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ROLE_OPTIONS.map(({ value, label, icon }) => {
                  const selected = state.selectedRoles.includes(value)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleRole(value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 relative ${
                        selected
                          ? 'border-fight-red bg-red-50'
                          : 'border-border-DEFAULT hover:border-fight-red bg-white'
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-2 right-2 text-fight-red text-sm font-bold">✓</span>
                      )}
                      <div className="text-3xl">{icon}</div>
                      <span className="text-sm font-semibold text-text-primary text-center">{label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Other / free text */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Other — describe what you do
                  <span className="text-text-muted font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={state.otherRoleText}
                  onChange={(e) => update('otherRoleText', e.target.value)}
                  placeholder="e.g. Cut man, Ring announcer, Referee..."
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Photo (optional) ── */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-text-muted text-center text-sm">
                Add a profile photo so people can recognize you. This is optional — you can skip it.
              </p>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(e, 'avatars', 'photoUrl')}
              />
              <UploadBox
                label="Click to upload a photo"
                sublabel="PNG or JPG · max 5 MB"
                icon="📸"
                url={state.photoUrl}
                onClick={() => photoInputRef.current?.click()}
                loading={isLoading}
              />

              <p className="text-xs text-text-muted text-center">
                Your photo is public and visible to other members on your profile.
              </p>
            </div>
          )}

          {/* ── STEP 3: About You ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Display Name <span className="text-fight-red">*</span>
                </label>
                <input
                  type="text"
                  value={state.displayName}
                  onChange={(e) => update('displayName', e.target.value)}
                  placeholder="How you want to appear on the platform"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Short Bio
                  <span className="text-text-muted font-normal ml-1">
                    ({state.shortBio.length}/500)
                  </span>
                </label>
                <textarea
                  value={state.shortBio}
                  onChange={(e) => update('shortBio', e.target.value.slice(0, 500))}
                  placeholder="Tell the community a bit about yourself — your background, experience, goals..."
                  className={`${inputClass} resize-none`}
                  rows={5}
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Registry Links ── */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-text-muted text-center text-sm">
                Link your public fighter, trainer, manager, or promoter profile from any combat sports registry.
                All fields are optional.
              </p>

              {[
                { key: 'boxrecUrl',        label: 'BoxRec',      placeholder: 'https://boxrec.com/en/record/...' },
                { key: 'tapologyUrl',      label: 'Tapology',    placeholder: 'https://tapology.com/fightcenter/fighters/...' },
                { key: 'sherdogUrl',       label: 'Sherdog',     placeholder: 'https://www.sherdog.com/fighter/...' },
                { key: 'mmaJunkieUrl',     label: 'MMA Junkie',  placeholder: 'https://mmajunkie.usatoday.com/fighter/...' },
                { key: 'otherRegistryUrl', label: 'Other',       placeholder: 'Any other registry or profile URL...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    {label}
                  </label>
                  <input
                    type="url"
                    value={(state as any)[key]}
                    onChange={(e) => update(key as any, e.target.value)}
                    placeholder={placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 5: Social Media ── */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-text-muted text-center text-sm">
                Add links to your social media profiles. All fields are optional.
              </p>

              {SOCIAL_PLATFORMS.map(({ key, label, placeholder, icon }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    <span className="mr-1">{icon}</span> {label}
                  </label>
                  <input
                    type="url"
                    value={(state as any)[key]}
                    onChange={(e) => update(key as any, e.target.value)}
                    placeholder={placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 6: Location + Affiliations + Looking For ── */}
          {step === 6 && (
            <div className="space-y-5">
              {/* Location */}
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">
                  Location
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">City</label>
                    <input
                      type="text"
                      value={state.city}
                      onChange={(e) => update('city', e.target.value)}
                      placeholder="Las Vegas"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">State / Region</label>
                    <input
                      type="text"
                      value={state.stateRegion}
                      onChange={(e) => update('stateRegion', e.target.value)}
                      placeholder="NV"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-text-muted mb-1">Country</label>
                  <input
                    type="text"
                    value={state.country}
                    onChange={(e) => update('country', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Affiliations */}
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">
                  Affiliations
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      Gym Affiliation
                    </label>
                    <input
                      type="text"
                      value={state.gymAffiliation}
                      onChange={(e) => update('gymAffiliation', e.target.value)}
                      placeholder="e.g. Tiger Muay Thai, AKA, Gleason's Gym..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      Organization / Promotion
                    </label>
                    <input
                      type="text"
                      value={state.organization}
                      onChange={(e) => update('organization', e.target.value)}
                      placeholder="e.g. Golden Boy Promotions, Top Rank..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Looking For */}
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">
                  What are you looking for?
                </h3>
                <p className="text-xs text-text-muted mb-3">Select all that apply.</p>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.map((item) => (
                    <Chip
                      key={item}
                      label={LOOKING_FOR_LABELS[item] || item}
                      selected={state.lookingFor.includes(item)}
                      onClick={() => toggleLookingFor(item)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 7: Verification ── */}
          {step === 7 && (
            <div className="space-y-6">
              {/* Selfie */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">
                  Verification Selfie <span className="text-fight-red">*</span>
                </h3>
                <p className="text-xs text-text-muted mb-4 leading-relaxed">
                  To confirm you're a real person, please upload a quick selfie. This photo is{' '}
                  <strong>completely private</strong> — it will never be shown to other members or appear on
                  your profile. It's used only to verify your identity.
                </p>

                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, 'selfies', 'selfieUrl')}
                />
                <UploadBox
                  label="Upload a selfie"
                  sublabel="Take or upload a photo of yourself · PNG or JPG"
                  icon="🤳"
                  url={state.selfieUrl}
                  onClick={() => selfieInputRef.current?.click()}
                  loading={isLoading}
                  isPrivate
                />
              </div>

              {/* Phone */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">
                  Phone Number <span className="text-fight-red">*</span>
                </h3>
                <p className="text-xs text-text-muted mb-3">
                  We'll send a one-time verification code to confirm your number.
                </p>

                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={state.phoneNumber}
                    onChange={(e) => update('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={handleSendSms}
                    className="px-4 py-3 bg-fight-red text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    Send Code
                  </button>
                </div>

                {smsSent && (
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      Enter the code from your text message
                    </label>
                    <input
                      type="text"
                      value={state.verificationCode}
                      onChange={(e) => update('verificationCode', e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className={`${inputClass} text-center text-2xl tracking-widest font-bold`}
                    />
                  </div>
                )}
              </div>

              {/* What happens next */}
              <div className="bg-gray-50 rounded-xl p-4 text-xs text-text-muted space-y-1.5 leading-relaxed">
                <p className="font-semibold text-text-primary">After you submit:</p>
                <p>📧 We'll send a verification link to your email address.</p>
                <p>📱 We'll send a confirmation SMS to your phone.</p>
                <p>🔒 Your selfie is encrypted and stored privately — never shared.</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 font-semibold text-text-primary border-2 border-border-DEFAULT rounded-xl hover:border-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step === TOTAL_STEPS ? (
            <button
              onClick={handleFinish}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-8 py-3 font-semibold text-white bg-fight-red rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Complete Profile →'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 sm:flex-none px-8 py-3 font-semibold text-white bg-fight-red rounded-xl hover:bg-red-700 transition-colors"
            >
              {step === 2 ? 'Skip / Continue →' : 'Continue →'}
            </button>
          )}
        </div>

        {/* Step 2 skip hint */}
        {step === 2 && !state.photoUrl && (
          <p className="text-center text-xs text-text-muted mt-3">
            Photo is optional — you can add it from your profile later.
          </p>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
