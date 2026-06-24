import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]           = useState('login') // 'login' | 'register'
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error('กรอก email และ password ด้วยนะ')
      return
    }
    if (mode === 'register' && !displayName) {
      toast.error('ใส่ชื่อที่จะให้คนอื่นเห็นด้วย')
      return
    }

    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        toast.error('Login ไม่ได้ เช็ค email/password อีกที')
      } else {
        toast.success('เข้าสู่ระบบแล้ว! 🎉')
        navigate('/')
      }
    } else {
      const { error } = await signUp(email, password, displayName)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('สมัครเสร็จ! เช็ค email ยืนยันด้วยนะ 📧')
        setMode('login')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-6 animate-fade-in">

      {/* Logo / Header */}
      <div className="mb-10 text-center animate-fade-up">
        <div className="text-5xl mb-3">🏫</div>
        <h1 className="text-2xl font-bold text-brand-text tracking-tight">
          Everyday Life
        </h1>
        <p className="text-brand-dim text-sm mt-1">
          School life, organized.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4 shadow-modal animate-scale-in delay-100">

        {/* Tab Toggle */}
        <div className="flex bg-brand-bg rounded-xl p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'login'
                ? 'bg-brand-accent text-brand-text'
                : 'text-brand-dim'
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'register'
                ? 'bg-brand-accent text-brand-text'
                : 'text-brand-dim'
            }`}
          >
            สมัครสมาชิก
          </button>
        </div>

        {/* Display Name (register only) */}
        {mode === 'register' && (
          <div className="space-y-1">
            <label className="text-xs text-brand-dim font-medium">ชื่อที่แสดง</label>
            <div className="flex items-center gap-3 bg-brand-bg border border-brand-border rounded-xl px-4 py-3">
              <User size={16} className="text-brand-dim shrink-0" />
              <input
                type="text"
                placeholder="ชื่อเล่น / ชื่อจริง"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="bg-transparent flex-1 text-brand-text text-sm outline-none placeholder:text-brand-dim"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs text-brand-dim font-medium">Email</label>
          <div className="flex items-center gap-3 bg-brand-bg border border-brand-border rounded-xl px-4 py-3">
            <Mail size={16} className="text-brand-dim shrink-0" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-transparent flex-1 text-brand-text text-sm outline-none placeholder:text-brand-dim"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs text-brand-dim font-medium">Password</label>
          <div className="flex items-center gap-3 bg-brand-bg border border-brand-border rounded-xl px-4 py-3">
            <Lock size={16} className="text-brand-dim shrink-0" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="bg-transparent flex-1 text-brand-text text-sm outline-none placeholder:text-brand-dim"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="text-brand-dim shrink-0"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-brand-accent text-brand-text font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
        >
          {loading
            ? <Loader2 size={18} className="animate-spin" />
            : mode === 'login' ? '🚀 เข้าสู่ระบบ' : '✨ สมัครเลย'
          }
        </button>

      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-brand-dim text-center">
        สมัครแล้วได้สิทธิ์ Student โดย default<br/>
        ติดต่อแอดมินเพื่ออัปเกรด Role
      </p>

    </div>
  )
}