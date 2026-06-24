import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage    from './pages/LoginPage'
import HomePage     from './pages/HomePage'
import TasksPage    from './pages/TasksPage'
import SchedulePage from './pages/SchedulePage'
import FinancePage  from './pages/FinancePage'
import AdminPage    from './pages/AdminPage'

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
      <Route path="/login"    element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/"         element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/tasks"    element={<PrivateRoute><TasksPage /></PrivateRoute>} />
      <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
      <Route path="/finance"  element={<PrivateRoute><FinancePage /></PrivateRoute>} />
      <Route path="/admin"    element={<PrivateRoute><AdminRoute><AdminPage /></AdminRoute></PrivateRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#2d2d2d',
              border: '1px solid #e8e4dc',
              borderRadius: '16px',
              fontSize: '14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            },
            success: { iconTheme: { primary: '#7fb069', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#e07070', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}