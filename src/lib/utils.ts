import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function relativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatRecord(w: number, l: number, d: number, kos?: number): string {
  const base = `${w}-${l}-${d}`
  if (kos != null && kos > 0) return `${base} (${kos} KO)`
  return base
}

export const ROLE_LABELS: Record<string, string> = {
  fighter: 'Fighter',
  trainer: 'Trainer / Coach',
  manager: 'Manager',
  promoter: 'Promoter',
  matchmaker: 'Matchmaker',
  provider: 'Service Provider',
}

export const ROLE_COLORS: Record<string, string> = {
  fighter: 'bg-red-100 text-red-800',
  trainer: 'bg-blue-100 text-blue-800',
  manager: 'bg-purple-100 text-purple-800',
  promoter: 'bg-amber-100 text-amber-800',
  matchmaker: 'bg-green-100 text-green-800',
  provider: 'bg-gray-100 text-gray-700',
}

export const DISCIPLINE_LABELS: Record<string, string> = {
  boxing: 'Boxing',
  mma: 'MMA',
  kickboxing: 'Kickboxing',
  muay_thai: 'Muay Thai',
  bjj: 'BJJ',
  wrestling: 'Wrestling',
  other: 'Other',
}

export const LOOKING_FOR_LABELS: Record<string, string> = {
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
  co_managers: 'Co-Managers',
  promoter_relationships: 'Promoter Relationships',
  matchmakers: 'Matchmakers',
  sponsors: 'Sponsors',
  venues: 'Venues',
  clients: 'Clients',
  partnerships: 'Partnerships',
  assistant_coaches: 'Assistant Coaches',
  gym_partnerships: 'Gym Partnerships',
  fighter_management: 'Fighter Management',
  sanctioning_bodies: 'Sanctioning Bodies',
}

export const WEIGHT_CLASS_LABELS: Record<string, string> = {
  strawweight: 'Strawweight (≤115)',
  flyweight: 'Flyweight (≤125)',
  bantamweight: 'Bantamweight (≤135)',
  featherweight: 'Featherweight (≤145)',
  lightweight: 'Lightweight (≤155)',
  welterweight: 'Welterweight (≤170)',
  middleweight: 'Middleweight (≤185)',
  light_heavyweight: 'Light Heavyweight (≤205)',
  heavyweight: 'Heavyweight (≤265)',
  super_heavyweight: 'Super Heavyweight (265+)',
}
