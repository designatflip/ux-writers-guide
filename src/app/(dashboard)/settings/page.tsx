import SectionVisibilitySettings from '@/components/SectionVisibilitySettings'

export default function SettingsPage() {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Settings</h1>

      <div className="space-y-6">
        <SectionVisibilitySettings />

        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Storage</p>
            <p className="text-sm font-medium text-slate-900">Supabase (cloud)</p>
            {projectUrl && (
              <p className="mt-0.5 text-xs text-slate-400 font-mono truncate">{projectUrl}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Authentication</p>
            <p className="text-sm text-slate-500">Disabled — all routes are publicly accessible.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
