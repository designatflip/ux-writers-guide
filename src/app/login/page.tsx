import Link from 'next/link'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Sign in</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Enter your email and password to continue.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  )
}
