export const MECHANICS_CATEGORIES = [
  'Punctuation',
  'Capitalization',
  'Numbering/Date & Time',
  'Bold · Italic · Underline',
] as const

export type MechanicsCategory = typeof MECHANICS_CATEGORIES[number]
