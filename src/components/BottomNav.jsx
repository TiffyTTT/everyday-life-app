import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, CheckSquare, Calendar, Shield } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const tabs = [
    { path: '/',         icon: Home,        label: 'หน้าหลัก' },
    { path: '/tasks',    icon: CheckSquare, label: 'งาน'      },
    { path: '/schedule', icon: Calendar,    label: 'ตาราง'    },
    ...(isAdmin ? [{ path: '/admin', icon: Shield, label: 'Admin' }] : []),
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-surface border-t border-brand-border"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                active ? 'bg-brand-accent/20' : ''
              }`}>
                <Icon
                  size={22}
                  className={active ? 'text-brand-accent' : 'text-brand-border'}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[10px] font-medium transition-all ${
                active ? 'text-brand-accent' : 'text-brand-border'
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