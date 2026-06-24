import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { LogOut, Bell, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function HomePage() {
  const { profile, signOut, isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHomeData = async () => {
    if (!profile) return
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', profile.id)
    setTasks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchHomeData()

    // ซิ้งค์ข้อมูลเรียลไทม์ หน้าแรกจะได้อัปเดตเลขทันที
    const channel = supabase
      .channel('home-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `assigned_to=eq.${profile?.id}` }, () => {
        fetchHomeData()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [profile])

  const handleSignOut = async () => {
    await signOut()
    toast.success('ออกจากระบบแล้ว 👋')
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'อรุณสวัสดิ์' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  // คำนวณตรรกะงาน
  const todoTasks = tasks.filter(t => t.status !== 'done').length
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const recentTasks = tasks.filter(t => t.status !== 'done').slice(0, 3)

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="text-brand-accent animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-brand-dim text-sm">{greeting} 👋</p>
            <h1 className="text-white text-2xl font-bold mt-0.5">
              {profile?.display_name || 'นักเรียน'}
            </h1>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mt-1.5 inline-block ${
              isAdmin ? 'bg-yellow-500/20 text-yellow-400' : 'bg-brand-accent/20 text-brand-accent'
            }`}>
              {isAdmin ? '👑 Admin' : '🎒 Student'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-brand-surface border border-brand-border rounded-xl">
              <Bell size={18} className="text-brand-dim" />
            </button>
            <button onClick={handleSignOut} className="p-2.5 bg-brand-surface border border-brand-border rounded-xl">
              <LogOut size={18} className="text-brand-dim" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
            <p className="text-brand-dim text-xs mb-1">งานที่ต้องทำ</p>
            <p className="text-white text-2xl font-bold">{todoTasks}</p>
            <p className="text-brand-border text-xs mt-1">รายการ</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
            <p className="text-brand-dim text-xs mb-1">เสร็จแล้ว</p>
            <p className="text-brand-accent text-2xl font-bold">{doneTasks}</p>
            <p className="text-brand-border text-xs mt-1">รายการ</p>
          </div>
        </div>
      </div>

      {/* Recent Tasks Preview */}
      <div className="px-5">
        <h2 className="text-white font-semibold mb-3">งานที่กำลังดองอยู่</h2>
        {recentTasks.length === 0 ? (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 flex flex-col items-center justify-center">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-brand-dim text-sm">ไม่มีงานค้างเลย โคตรตึง!</p>
          </div>
        ) : (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 space-y-3">
            {recentTasks.map(t => (
              <div key={t.id} className="flex items-center justify-between border-b border-brand-border/40 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="text-white text-sm font-medium">{t.title}</p>
                  <p className="text-brand-border text-[10px]">สถานะ: {t.status === 'todo' ? 'รอทำ' : 'กำลังปั่น'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}