import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import {
  LogOut, BookOpen, CheckSquare, Wallet,
  AlarmClock, ChevronRight, Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

function BentoCard({ children, className = '', onClick, delay = '' }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-3xl border border-brand-border shadow-card
        animate-fade-up ${delay}
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97] active:shadow-card-press' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-3xl border border-brand-border shadow-card p-4 ${className}`}>
      <div className="skeleton h-4 w-24 mb-3" />
      <div className="skeleton h-8 w-16 mb-2" />
      <div className="skeleton h-3 w-32" />
    </div>
  )
}

export default function HomePage() {
  const { profile, signOut, isAdmin } = useAuth()
  const navigate  = useNavigate()
  const [tasks, setTasks]       = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading]   = useState(true)

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'อรุณสวัสดิ์ 🌤️' :
    hour < 17 ? 'สวัสดีตอนบ่าย ☀️' :
                'สวัสดีตอนเย็น 🌙'

  const thaiDays = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์']
  const engDays  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  const now      = new Date()
  const todayDay = now.getDay()
  const dateStr  = `${thaiDays[todayDay]}ที่ ${now.getDate()} ${months[now.getMonth()]}`

  useEffect(() => {
    if (!profile?.id) return
    const fetchAll = async () => {
      setLoading(true)
      const [{ data: taskData }, { data: schedData }] = await Promise.all([
        supabase
          .from('tasks')
          .select('*')
          .eq('assigned_to', profile.id)
          .neq('status', 'done')
          .order('due_date', { ascending: true }),
        supabase
          .from('schedules')
          .select('*')
          .eq('day_of_week', engDays[todayDay])
          .order('start_time', { ascending: true }),
      ])
      setTasks(taskData || [])
      setSchedule(schedData || [])
      setLoading(false)
    }
    fetchAll()
  }, [profile])

  const pendingTasks = tasks.filter(t => t.status === 'todo')
  const doneTasks    = tasks.filter(t => t.status === 'done')
  const allTasks     = tasks
  const urgentTasks  = tasks.filter(t => {
    if (!t.due_date) return false
    const diff = new Date(t.due_date) - new Date()
    return diff > 0 && diff < 1000 * 60 * 60 * 48
  })

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const nextClass  = schedule.find(s => {
    const [h, m] = (s.start_time || '00:00').split(':').map(Number)
    return h * 60 + m > nowMinutes
  })

  const formatDueDate = (due) => {
    if (!due) return 'ไม่มี deadline'
    const d   = new Date(due)
    const hrs = Math.floor((d - new Date()) / (1000 * 60 * 60))
    if (hrs < 24) return `อีก ${hrs} ชม.`
    if (hrs < 48) return 'พรุ่งนี้'
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('ออกจากระบบแล้ว 👋')
  }

  return (
    <Layout>
      <div className="px-4 pt-12 pb-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-5 animate-fade-up">
          <div>
            <p className="text-sm text-brand-muted font-medium">{greeting}</p>
            <h1 className="text-2xl font-bold text-brand-text tracking-tight mt-0.5">
              {profile?.display_name || profile?.email?.split('@')[0] || 'นักเรียน'}
            </h1>
            <span className={`
              text-xs font-semibold px-3 py-1 rounded-full mt-1.5 inline-block
              animate-scale-in delay-200
              ${isAdmin
                ? 'bg-purple-100 text-purple-700'
                : 'bg-brand-sage-light text-brand-sage'
              }
            `}>
              {isAdmin ? '👑 Admin' : '🎒 Student'}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-1 p-2.5 bg-white rounded-2xl shadow-card border border-brand-border
                       active:scale-90 hover:shadow-card-hover transition-all duration-200
                       animate-fade-in delay-300"
          >
            <LogOut size={18} className="text-brand-muted" />
          </button>
        </div>

        {/* ── Bento Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            <SkeletonCard className="col-span-2 h-44" />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard className="col-span-2 h-32" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">

            {/* กล่อง 1: ตารางเรียนวันนี้ */}
            <BentoCard
              className="col-span-2 p-4 glow-sage delay-100"
              onClick={() => navigate('/schedule')}
            >
              <div className="relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-brand-sage-light opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-purple-50 opacity-30 pointer-events-none" />

                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-sage-light flex items-center justify-center shadow-inner-sm">
                      <BookOpen size={16} className="text-brand-sage" />
                    </div>
                    <div>
                      <p className="text-[11px] text-brand-muted font-medium">ตารางเรียนวันนี้</p>
                      <p className="text-[14px] font-bold text-brand-text leading-tight">{dateStr}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-brand-muted" />
                </div>

                {schedule.length === 0 ? (
                  <div className="bg-brand-bg rounded-2xl px-4 py-4 text-center border border-dashed border-brand-border relative z-10">
                    <p className="text-brand-muted text-xs">ยังไม่ได้ใส่ตารางเรียน</p>
                    <p className="text-brand-sage text-xs font-semibold mt-1">กดไปที่แท็บ ตาราง →</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 relative z-10">
                    {schedule.slice(0, 3).map((s) => {
                      const isNext = nextClass?.id === s.id
                      return (
                        <div
                          key={s.id}
                          className={`
                            flex items-center gap-2.5 px-3 py-2.5 rounded-2xl
                            transition-all duration-200
                            ${isNext
                              ? 'bg-purple-50 border border-purple-200 shadow-sm'
                              : 'bg-brand-bg'
                            }
                          `}
                        >
                          <span className={`text-[11px] font-bold min-w-[38px] ${
                            isNext ? 'text-purple-600' : 'text-brand-sage'
                          }`}>
                            {(s.start_time || '').slice(0, 5)}
                          </span>
                          <span className={`text-xs flex-1 font-medium ${
                            isNext ? 'text-purple-800' : 'text-brand-text'
                          }`}>
                            {s.subject_name}
                          </span>
                          {isNext && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-semibold">
                              ถัดไป
                            </span>
                          )}
                          {s.room_number && !isNext && (
                            <span className="text-[10px] bg-brand-sage-light text-brand-sage px-2 py-0.5 rounded-full">
                              {s.room_number}
                            </span>
                          )}
                        </div>
                      )
                    })}
                    {schedule.length > 3 && (
                      <p className="text-center text-[11px] text-brand-muted pt-1">
                        +{schedule.length - 3} คาบ • กดดูทั้งหมด
                      </p>
                    )}
                  </div>
                )}
              </div>
            </BentoCard>

            {/* กล่อง 2: งานค้าง */}
            <BentoCard
              className="p-4 glow-purple delay-150"
              onClick={() => navigate('/tasks')}
            >
              <div className="relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-purple-50 opacity-70 pointer-events-none" />
                <CheckSquare size={20} className="text-purple-500 mb-3" />
                <p className="text-4xl font-bold text-brand-text leading-none">
                  {pendingTasks.length}
                </p>
                <p className="text-[11px] text-brand-muted mt-1.5 mb-3 font-medium">งานค้าง</p>
                <div className="h-2 bg-purple-50 rounded-full overflow-hidden shadow-inner-sm">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-1000"
                    style={{
                      width: allTasks.length > 0
                        ? `${((allTasks.length - pendingTasks.length) / allTasks.length) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
                <p className="text-[10px] text-brand-muted mt-1.5">
                  เสร็จ {doneTasks.length}/{allTasks.length}
                </p>
              </div>
            </BentoCard>

            {/* กล่อง 3: การเงิน */}
            <BentoCard
              className="p-4 glow-amber delay-200"
              onClick={() => navigate('/finance')}
            >
              <div className="relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-amber-50 opacity-70 pointer-events-none" />
                <Wallet size={20} className="text-amber-500 mb-3" />
                <p className="text-4xl font-bold text-brand-text leading-none">฿0</p>
                <p className="text-[11px] text-brand-muted mt-1.5 mb-3 font-medium">ใช้ไปวันนี้</p>
                <div className="h-2 bg-amber-50 rounded-full overflow-hidden shadow-inner-sm">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-0 transition-all duration-1000" />
                </div>
                <p className="text-[10px] text-brand-muted mt-1.5">งบ ฿0/วัน</p>
              </div>
            </BentoCard>

            {/* กล่อง 4: Deadline */}
            <BentoCard
              className="col-span-2 p-4 delay-300"
              onClick={() => navigate('/tasks')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center">
                    <AlarmClock size={14} className="text-red-400" />
                  </div>
                  <p className="text-[13px] font-bold text-brand-text">ใกล้ถึง Deadline</p>
                </div>
                <span className="text-[11px] text-brand-muted flex items-center gap-0.5 font-medium">
                  ดูทั้งหมด <ChevronRight size={11} />
                </span>
              </div>

              {urgentTasks.length === 0 ? (
                <div className="flex items-center gap-3 py-2 px-2 bg-brand-bg rounded-2xl">
                  <span className="text-2xl animate-bounce-in">🎉</span>
                  <div>
                    <p className="text-sm font-semibold text-brand-text">ไม่มีงานเร่งด่วน!</p>
                    <p className="text-xs text-brand-muted">เก่งมากเลยนะ ✨</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {urgentTasks.slice(0, 3).map((task, i) => {
                    const hrs = Math.floor((new Date(task.due_date) - new Date()) / (1000 * 60 * 60))
                    const isVeryUrgent = hrs < 24
                    return (
                      <div
                        key={task.id}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-2xl
                          animate-slide-right
                          ${i === 0 ? 'delay-100' : i === 1 ? 'delay-150' : 'delay-200'}
                          ${isVeryUrgent
                            ? 'bg-red-50 border border-red-100'
                            : 'bg-brand-bg'
                          }
                        `}
                      >
                        <div className={`w-1 h-8 rounded-full flex-shrink-0 ${
                          isVeryUrgent ? 'bg-red-400' : 'bg-brand-border'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold truncate ${
                            isVeryUrgent ? 'text-red-800' : 'text-brand-text'
                          }`}>
                            {task.title}
                          </p>
                          <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${
                            isVeryUrgent ? 'text-red-500' : 'text-brand-muted'
                          }`}>
                            <Clock size={9} />
                            {formatDueDate(task.due_date)}
                          </p>
                        </div>
                        {isVeryUrgent && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0 shadow-sm">
                            เร่งด่วน
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </BentoCard>

          </div>
        )}
      </div>
    </Layout>
  )
}
