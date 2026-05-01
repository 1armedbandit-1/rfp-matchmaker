export type UserRole = 'fighter' | 'trainer' | 'manager' | 'promoter' | 'matchmaker' | 'provider'
export type Discipline = 'boxing' | 'mma' | 'kickboxing' | 'muay_thai' | 'bjj' | 'wrestling' | 'other'
export type WeightClass = 'strawweight' | 'flyweight' | 'bantamweight' | 'featherweight' | 'lightweight' | 'welterweight' | 'middleweight' | 'light_heavyweight' | 'heavyweight' | 'super_heavyweight'
export type ContactMethod = 'email' | 'phone' | 'instagram' | 'facebook' | 'signal' | 'whatsapp' | 'in_app'
export type FighterStatus = 'active' | 'inactive' | 'retired'
export type AmOrPro = 'amateur' | 'professional' | 'both'
export type ProviderServiceType = 'cutman' | 'sports_medicine' | 'physical_therapy' | 'nutrition' | 'sports_law' | 'sponsorship' | 'media' | 'other'

export type LookingFor =
  | 'fights' | 'trainer' | 'manager' | 'promoter' | 'sponsorship' | 'sparring_partners'
  | 'gym' | 'nutrition' | 'sports_medicine' | 'fighters' | 'co_managers' | 'promoter_relationships'
  | 'matchmakers' | 'sponsors' | 'venues' | 'clients' | 'partnerships' | 'assistant_coaches'
  | 'gym_partnerships' | 'fighter_management' | 'sanctioning_bodies'

export interface UserProfile {
  id: string
  display_name: string
  profile_photo_url: string | null
  primary_role: UserRole
  secondary_roles: UserRole[]
  city: string | null
  state_region: string | null
  country: string | null
  short_bio: string | null
  preferred_contact_method: ContactMethod | null
  preferred_contact_value: string | null
  is_profile_complete: boolean
  created_at: string
  updated_at: string
  fighter_profile?: FighterProfile
  trainer_profile?: TrainerProfile
  manager_profile?: ManagerProfile
  promoter_profile?: PromoterProfile
  matchmaker_profile?: MatchmakerProfile
  provider_profile?: ProviderProfile
}

export interface FighterProfile {
  user_id: string
  discipline: Discipline[]
  status: FighterStatus
  am_or_pro: AmOrPro
  weight_lbs: number | null
  weight_class: WeightClass | null
  record_pro_w: number
  record_pro_l: number
  record_pro_d: number
  record_pro_kos: number
  record_am_w: number
  record_am_l: number
  record_am_d: number
  boxrec_url: string | null
  tapology_url: string | null
  sherdog_url: string | null
  mma_junkie_url: string | null
  other_registry_url: string | null
  looking_for: LookingFor[]
  gym_affiliation: string | null
}

export interface TrainerProfile {
  user_id: string
  gym_name: string | null
  gym_address: string | null
  disciplines: Discipline[]
  specialties: string | null
  years_experience: number | null
  accepting_new_fighters: boolean
  looking_for: LookingFor[]
}

export interface ManagerProfile {
  user_id: string
  company_name: string | null
  current_roster_size: number | null
  disciplines: Discipline[]
  looking_for: LookingFor[]
}

export interface PromoterProfile {
  user_id: string
  organization_name: string | null
  events_per_year: number | null
  sanctioning_bodies: string[]
  disciplines: Discipline[]
  looking_for: LookingFor[]
}

export interface MatchmakerProfile {
  user_id: string
  organizations_worked_with: string[]
  disciplines: Discipline[]
  looking_for: LookingFor[]
}

export interface ProviderProfile {
  user_id: string
  service_type: ProviderServiceType
  credentials: string | null
  service_area_radius_miles: number | null
  looking_for: LookingFor[]
}

export interface Post {
  id: string
  user_id: string
  body: string
  media_url: string | null
  like_count: number
  comment_count: number
  created_at: string
  author: UserProfile
  user_has_liked?: boolean
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  author: UserProfile
}

export interface MatchResult {
  user_id: string
  score: number
  reasoning: string
  profile: UserProfile
}
