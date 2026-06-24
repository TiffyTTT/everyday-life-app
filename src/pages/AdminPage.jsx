import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { Users, Plus, Clock, CheckCircle, Circle, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

// Modal สร้างงานใหม่
function BroadcastModal({ onClose, onSuccess, students }) {
  const { profile } = useAuth()
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate]       = useState('')
  const [assignTo, setAssignTo]     = useState('all') // 'all' | uuid
  const [loading, setLoading]       = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error('ใส่ชื่องานด้วยนะ'); return }

    setLoading(true)

    // สร้าง list ของคนที่จะ assign
    const targets = assignTo === 'all'
      ? students.map(s => s.id)
      : [assignTo]

    // insert tasks ทีละคน
    const tasks = targets.map(userId => ({
      title: title.trim(),
      description: description.trim() || null,
      assigned_to: userId,
      created_by: profile.id,
      status: 'todo',
      due_date: dueDate || null,
      is_group_task: true,
    }))

    const { error } = await supabase.from('tasks').insert(tasks)

    if (error) {
      toast.error('สร้างงานไม่ได้: ' + error.message)
    } else {
      toast.success(`✅ Assign งานให้ ${targets.length} คนแล้ว!`)
      onSuccess()
      onClose()
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold text-lg">📢 Broadcast งาน</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-brand-bg">
            <X size={16} className="text-brand-dim" />
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs text-brand-dim font-medium">ชื่องาน *</label>
          <input
            type="text"
            placeholder="เช่น ส่งรายงานวิทย์"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-brand-border"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-brand-dim font-medium">รายละเอียด (optional)</label>
          <textarea
            placeholder="อธิบายเพิ่มเติม..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-brand-border resize-none"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="text-xs text-brand-dim font-medium">กำหนดส่ง</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none"
          />
        </div>

        {/* Assign To */}
        <div>
          <label className="text-xs text-brand-dim font-medium">Assign ให้</label>
          <select
            value={assignTo}
            onChange={e => setAssignTo(e.target.value)}
            className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none"
          >
            <option value="all">👥 ทุกคนในกลุ่ม</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                👤 {s.display_name || s.email}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-brand-accent text-brand-bg font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
        >
          {loading
            ? <Loader2 size={18} className="animate-spin" />
            : '🚀 ส่งงานเลย'
          }
        </button>
      </div>
    </div>
  )
}

// Card แสดงข้อมูลแต่ละคน
function StudentCard({ student, tasks }) {
  const todo       = tasks.filter(t => t.status === 'todo').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const done       = tasks.filter(t => t.status === 'done').length
  const total      = tasks.length

  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white font-semibold text-sm">
            {student.display_name || student.email?.split('@')[0]}
          </p>
          <p className="text-brand-border text-xs">{student.email}</p>
        </div>
        <span className="text-xs bg-brand-bg border border-brand-border px-2 py-1 rounded-lg text-brand-dim">
          {total} งาน
        </span>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="mb-3">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-brand-bg gap-0.5">
            <div
              className="bg-brand-accent rounded-full transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <p className="text-brand-border text-xs mt-1">
            เสร็จ {done}/{total}
          </p>
        </div>
      )}

      {/* Status Chips */}
      <div className="flex gap-2">
        <span className="flex items-center gap-1 text-xs bg-brand-bg px-2 py-1 rounded-lg text-brand-border">
          <Circle size={10} /> {todo} รอ
        </span>
        <span className="flex items-center gap-1 text-xs bg-yellow-500/10 px-2 py-1 rounded-lg text-yellow-400">
          <Clock size={10} /> {inProgress} กำลังทำ
        </span>
        <span className="flex items-center gap-1 text-xs bg-brand-accent/10 px-2 py-1 rounded-lg text-brand-accent">
          <CheckCircle size={10} /> {done} เสร็จ
        </span>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [students, setStudents] = useState([])
  const [tasks, setTasks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchData = async () => {
    setLoading(true)

    // ดึงสมาชิกทุกคนมาเลย (รวมแอดมินด้วย)
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')

    // ดึง tasks ทั้งหมด
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    setStudents(profilesData || [])
    setTasks(tasksData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    // Realtime subscription
    const channel = supabase
      .channel('admin-tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
      }, () => {
        fetchData() // refresh เมื่อมีการเปลี่ยนแปลง
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const totalDone = tasks.filter(t => t.status === 'done').length
  const totalTasks = tasks.length

  return (
    <Layout>
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-white text-2xl font-bold">👑 Admin Dashboard</h1>
        <p className="text-brand-dim text-sm mt-1">สอดส่องลูกน้อง</p>
      </div>

      {/* Summary Cards */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-3 text-center">
            <p className="text-white text-xl font-bold">{students.length}</p>
            <p className="text-brand-border text-xs mt-0.5">สมาชิก</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-3 text-center">
            <p className="text-white text-xl font-bold">{totalTasks}</p>
            <p className="text-brand-border text-xs mt-0.5">งานทั้งหมด</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-3 text-center">
            <p className="text-brand-accent text-xl font-bold">{totalDone}</p>
            <p className="text-brand-border text-xs mt-0.5">เสร็จแล้ว</p>
          </div>
        </div>
      </div>

      {/* Broadcast Button */}
      <div className="px-5 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-brand-accent text-brand-bg font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Plus size={20} />
          Broadcast งานใหม่
        </button>
      </div>

      {/* Student List */}
      <div className="px-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-brand-dim" />
          <h2 className="text-white font-semibold">รายชื่อสมาชิก</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="text-brand-accent animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 text-center">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-brand-dim text-sm">ยังไม่มีสมาชิกในระบบ</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                tasks={tasks.filter(t => t.assigned_to === student.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <BroadcastModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
          students={students}
        />
      )}
    </Layout>
  )
}