import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage    from './pages/LoginPage'
import HomePage     from './pages/HomePage'
import TasksPage    from './pages/TasksPage'
import SchedulePage from './pages/SchedulePage'
import AdminPage    from './pages/AdminPage'

function UpdateNotification() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW()
  if (!needRefresh) return null
  return (
    <div className="fixed top-4 left-4 right-4 bg-brand-accent text-brand-bg p-4 rounded-xl flex justify-between items-center z-[200] shadow-xl">
      <span className="text-sm font-bold">✨ เห้ย มีอัปเดตแอปใหม่ว่ะ!</span>
      <button onClick={() => updateServiceWorker(true)} className="bg-brand-bg text-white px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95">
        โหลดเดี๋ยวนี้
      </button>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  return isAdmin ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
      <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminPage /></AdminRoute></PrivateRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <UpdateNotification />
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#111a13',
              color: '#fff',
              border: '1px solid #1e2d20',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#111a13' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#111a13' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}