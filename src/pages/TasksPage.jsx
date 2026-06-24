import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { CheckCircle, Circle, Clock, Loader2, Edit2, Trash2, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

// ป๊อปอัพ เพิ่มงานส่วนตัว (กลางจอ)
function AddTaskModal({ onClose, onSuccess, userId }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) { toast.error('ใสชื่องานก่อนดิเว้ย'); return }
    setLoading(true)

    const { error } = await supabase
      .from('tasks')
      .insert([{
        title: title.trim(),
        description: description.trim() || null,
        assigned_to: userId,
        status: 'todo',
        due_date: dueDate || null,
        is_group_task: false // งานส่วนตัว
      }])

    if (error) {
      toast.error('เพิ่มงานไม่ได้ว่ะ: ' + error.message)
    } else {
      toast.success('เพิ่มงานส่วนตัวแล้ว! ✏️')
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-brand-border rounded-2xl p-6 space-y-4 z-10 max-h-[90vh] overflow-y-auto shadow-modal animate-scale-in">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-brand-text font-bold text-lg">➕ เพิ่มงานใหม่</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-brand-bg">
            <X size={16} className="text-brand-dim" />
          </button>
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">ชื่องาน *</label>
          <input type="text" placeholder="เช่น การบ้านเลข" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm outline-none placeholder:text-brand-dim" />
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">รายละเอียด</label>
          <textarea placeholder="โน้ตเพิ่มเติม..." value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm outline-none resize-none placeholder:text-brand-dim" />
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">กำหนดส่ง</label>
          <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm outline-none" />
        </div>
        <button onClick={handleCreate} disabled={loading} className="w-full bg-brand-accent text-brand-text font-semibold py-3 rounded-xl flex justify-center">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'เพิ่มงานเลย'}
        </button>
      </div>
    </div>
  )
}

// ป๊อปอัพ แก้ไขงาน (กลางจอ)
function EditModal({ task, onClose, onSuccess }) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [dueDate, setDueDate] = useState(task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) { toast.error('ตั้งชื่องานด้วยดิเห้ย'); return }
    setLoading(true)
    const { error } = await supabase
      .from('tasks')
      .update({ title: title.trim(), description: description.trim() || null, due_date: dueDate || null })
      .eq('id', task.id)

    if (error) {
      toast.error('แก้ไม่ได้ว่ะ')
    } else {
      toast.success('อัปเดตงานเรียบร้อย!')
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-brand-border rounded-2xl p-6 space-y-4 z-10 max-h-[90vh] overflow-y-auto shadow-modal animate-scale-in">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-brand-text font-bold text-lg">✏️ แก้ไขงาน</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-brand-bg">
            <X size={16} className="text-brand-dim" />
          </button>
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">ชื่องาน *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm outline-none" />
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">รายละเอียด</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">กำหนดส่ง</label>
          <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-text text-sm outline-none" />
        </div>
        <button onClick={handleSave} disabled={loading} className="w-full bg-brand-accent text-brand-text font-semibold py-3 rounded-xl flex justify-center">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'บันทึกการแก้ไข'}
        </button>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { profile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchTasks = async () => {
    if (!profile) return
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', profile.id)
      .order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
    const channel = supabase
      .channel('my-tasks-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `assigned_to=eq.${profile?.id}` }, () => {
        fetchTasks()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [profile])

  const toggleStatus = async (task) => {
    const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo'
    await supabase.from('tasks').update({ status: nextStatus }).eq('id', task.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('จะลบงานนี้ทิ้งจริงดิ?')) return
    await supabase.from('tasks').delete().eq('id', id)
    toast.success('ลบทิ้งละ!')
  }

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
      <div className="px-5 pt-14 pb-4 flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-brand-text text-2xl font-bold">✅ งานของฉัน</h1>
          <p className="text-brand-dim text-sm mt-1">จัดการชีวิตตัวเองสะ</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="p-3 bg-brand-sage text-white rounded-xl font-bold active:scale-95 transition-all shadow-button hover:shadow-button hover:-translate-y-0.5 flex items-center gap-1 text-sm animate-fade-in delay-100">
          <Plus size={16} /> เพิ่มงาน
        </button>
      </div>

      <div className="px-5 space-y-3 pb-6 animate-fade-up delay-150">
        {tasks.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-2xl p-8 text-center shadow-card animate-fade-up delay-200">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-brand-dim text-sm">โคตรว่าง ไม่มีงานค้างเลยว่ะ</p>
          </div>
        ) : (
          tasks.map((task, i) => (
            <div key={task.id} className={`bg-white border border-brand-border rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200 animate-slide-right glow-purple ${i === 0 ? 'delay-200' : i === 1 ? 'delay-250' : 'delay-300'}`}>
              <div className="flex gap-3">
                <button onClick={() => toggleStatus(task)} className="mt-0.5 shrink-0 transition-transform active:scale-90">
                  {task.status === 'todo' && <Circle size={24} className="text-brand-dim" />}
                  {task.status === 'in-progress' && <Clock size={24} className="text-yellow-400" />}
                  {task.status === 'done' && <CheckCircle size={24} className="text-brand-accent" />}
                </button>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${task.status === 'done' ? 'text-brand-dim line-through' : 'text-brand-text'}`}>
                    {task.title}
                  </h3>
                  {task.description && <p className="text-brand-dim text-xs mt-1">{task.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                      task.status === 'todo' ? 'bg-red-50 text-red-600' : task.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-brand-accent/10 text-brand-accent'
                    }`}>
                      {task.status === 'todo' ? 'รอทำ' : task.status === 'in-progress' ? 'กำลังปั่น' : 'เสร็จละ!'}
                    </span>
                    <span className="text-[10px] text-brand-dim">
                      {task.is_group_task ? '👥 งานกลุ่ม' : '👤 ส่วนตัว'}
                    </span>
                    {task.due_date && <span className="text-[10px] text-brand-dim">⏰ ส่ง: {new Date(task.due_date).toLocaleDateString('th-TH')}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-brand-border/50 justify-end">
                <button onClick={() => setEditingTask(task)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-bg text-brand-dim rounded-lg"><Edit2 size={12} /> แก้ไข</button>
                <button onClick={() => handleDelete(task.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg"><Trash2 size={12} /> ลบ</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && <AddTaskModal userId={profile.id} onClose={() => setShowAddModal(false)} onSuccess={fetchTasks} />}
      {editingTask && <EditModal task={editingTask} onClose={() => setEditingTask(null)} onSuccess={fetchTasks} />}
    </Layout>
  )
}