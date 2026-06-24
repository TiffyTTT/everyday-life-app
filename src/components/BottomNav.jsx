import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, CheckSquare, Calendar, Wallet, Shield } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const tabs = [
    { path: '/',          icon: Home,        label: 'หน้าหลัก' },
    { path: '/tasks',     icon: CheckSquare, label: 'งาน'      },
    { path: '/schedule',  icon: Calendar,    label: 'ตาราง'    },
    { path: '/finance',   icon: Wallet,      label: 'การเงิน'  },
    ...(isAdmin ? [{ path: '/admin', icon: Shield, label: 'Admin' }] : []),
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-brand-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all active:scale-90"
            >
              <div className={`p-2 rounded-2xl transition-all duration-200 ${
                active ? 'bg-brand-sage-light' : 'bg-transparent'
              }`}>
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    active ? 'text-brand-sage' : 'text-brand-muted'
                  }`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[9px] font-medium transition-colors duration-200 ${
                active ? 'text-brand-sage' : 'text-brand-muted'
              }`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}