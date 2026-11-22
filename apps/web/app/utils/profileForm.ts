import type { Pace, Profile, ProfileInput, Severity } from '@aphasia/shared'

export const emptyProfileForm: ProfileInput = {
  firstName: '',
  birthDate: '',
  disorderType: '',
  severity: '',
  preferredPace: 'normal',
  occupation: '',
  hobbies: [],
}

/** Збережений профіль → значення форми (undefined стає порожнім рядком для полів вводу). */
export function profileToForm(profile: Profile): ProfileInput {
  return {
    firstName: profile.firstName,
    birthDate: profile.birthDate ?? '',
    language: profile.language,
    disorderType: profile.disorderType ?? '',
    severity: profile.severity ?? '',
    preferredPace: profile.preferredPace,
    occupation: profile.occupation ?? '',
    hobbies: [...profile.hobbies],
  }
}

/** "читання, сад , ,музика" → ["читання", "сад", "музика"] */
export function parseList(text: string): string[] {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export const severityOptions: { value: Severity | ''; label: string }[] = [
  { value: '', label: 'Не вказано' },
  { value: 'MILD', label: 'Легкий' },
  { value: 'MODERATE', label: 'Середній' },
  { value: 'SEVERE', label: 'Важкий' },
]

export const paceOptions: { value: Pace; label: string }[] = [
  { value: 'slow', label: 'Повільний' },
  { value: 'normal', label: 'Звичайний' },
  { value: 'fast', label: 'Швидкий' },
]
