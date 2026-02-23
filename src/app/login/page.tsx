'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { toast } from 'sonner'

// Custom Google Logo Component
const GoogleLogo = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'coach'>('student')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginWithEmail(email, password)
  }

  const handleGoogleLogin = () => {
    // If a role is selected, pass it. If not, just proceed (for existing users).
    loginWithGoogle(role || undefined)
  }

  return (
    <div className="min-h-[80vh] flex flex-col bg-white font-montserrat">

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-black font-montserrat">Login</h1>

        <div className="w-full max-w-md space-y-6">


          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-500 rounded-full py-3 hover:bg-gray-50 transition text-black font-bold font-montserrat"
          >
            <GoogleLogo />
            Login with google
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-500"></div>
            <span className="flex-shrink-0 mx-4 text-black font-[450] text-lg font-montserrat">Or login with email</span>
            <div className="flex-grow border-t border-gray-500"></div>
          </div>

          {/* Email Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 font-montserrat"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 font-montserrat"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-center">
              <Link href="/forgot-password" className="text-[#0088EE] font-[550] text-lg hover:underline font-montserrat">
                Forgot Password?
              </Link>
            </div>

            {/* Continue Button */}
            <button type="submit" className="w-full bg-[#0088EE] text-white font-bold py-3.5 rounded-full hover:bg-blue-600 transition-colors shadow-md font-montserrat">
              Continue
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-lg font-[450] text-black mt-4 font-montserrat">
            Don't have an account? <Link href="/signup" className="text-[#0088EE] font-bold hover:underline">Sign Up</Link>
          </div>
        </div>
      </main>

    </div>
  )
}
