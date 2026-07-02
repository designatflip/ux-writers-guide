export const MECHANICS_CATEGORIES = [
  'Punctuation',
  'Capitalization',
  'Numbering/Date & Time',
  'Text Formatting',
] as const

export type MechanicsCategory = typeof MECHANICS_CATEGORIES[number]

export function getMechanicsFormKind(category: string): 'capitalization' | 'repeater' {
  return category === 'Capitalization' ? 'capitalization' : 'repeater'
}
