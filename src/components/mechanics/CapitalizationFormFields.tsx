'use client'

import Textarea from '@/components/ui/Textarea'
import TagInput from '@/components/ui/TagInput'

interface CapitalizationFormFieldsProps {
  description: string
  textComponents: string[]
  uiComponents: string[]
  onDescriptionChange: (v: string) => void
  onTextComponentsChange: (v: string[]) => void
  onUiComponentsChange: (v: string[]) => void
}

export default function CapitalizationFormFields({
  description,
  textComponents,
  uiComponents,
  onDescriptionChange,
  onTextComponentsChange,
  onUiComponentsChange,
}: CapitalizationFormFieldsProps) {
  return (
    <div className="space-y-4">
      <Textarea
        label="Description / Use case"
        placeholder="Describe when and where this capitalization style is used…"
        rows={3}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      <TagInput
        label="Text components"
        items={textComponents}
        onChange={onTextComponentsChange}
        placeholder="e.g. email subject — press Enter to add"
      />

      <TagInput
        label="UI components"
        items={uiComponents}
        onChange={onUiComponentsChange}
        placeholder="e.g. Button label — press Enter to add"
      />
    </div>
  )
}
