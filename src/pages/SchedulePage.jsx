import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { Plus, Trash2, Clock, MapPin, User, X, Loader2, BookOpen, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = [
  { key: 'Monday', label: 'จ.', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { key: 'Tuesday', label: 'อ.', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { key: 'Wednesday', label: 'พ.', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { key: 'Thursday', label: 'พฤ.', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { key: 'Friday', label: 'ศ.', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
]

// Modal สำหรับแก้ไขคาบเรียนเดิม
const EditClassModal = ({ classItem, onClose, onSuccess }) => {
  const [subject, setSubject] = useState(classItem.subject_name)
  const [room, setRoom] = useState(classItem.room_number || '')
  const [teacher, setTeacher] = useState(classItem.teacher_name || '')
  const [startTime, setStartTime] = useState(classItem.start_time)
  const [endTime, setEndTime] = useState(classItem.end_time)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!subject.trim()) { toast.error('ใส่วิชาเรียนด้วยดิ'); return }
    setLoading(true)

    const { error } = await supabase
      .from('schedules')
      .update({
        subject_name: subject.trim(),
        room_number: room.trim() || null,
        teacher_name: teacher.trim() || null,
        start_time: startTime,
        end_time: endTime
      })
      .eq('id', classItem.id)

    if (error) {
      toast.error('แก้ไขไม่ได้ว่ะ: ' + error.message)
    } else {
      toast.success('อัปเดตตารางเรียนแล้ว! ✨')
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold text-lg">✏️ แก้ไขคาบเรียน</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-brand-bg">
            <X size={16} className="text-brand-dim" />
          </button>
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">ชื่อวิชา *</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-dim font-medium">ห้องเรียน</label>
            <input type="text" value={room} onChange={e => setRoom(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs text-brand-dim font-medium">ครูผู้สอน</label>
            <input type="text" value={teacher} onChange={e => setTeacher(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-dim font-medium">เวลาเริ่ม</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs text-brand-dim font-medium">เวลาเลิก</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
        </div>
        <button onClick={handleUpdate} disabled={loading} className="w-full bg-brand-accent text-brand-bg font-semibold py-3 rounded-xl flex justify-center">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'บันทึกการแก้ไข'}
        </button>
      </div>
    </div>
  )
}

// Modal เพิ่มคาบเรียนใหม่ (ก๊อปมาจากอันเดิม)
const AddClassModal = ({ day, onClose, onSuccess }) => {
  const [subject, setSubject] = useState('')
  const [room, setRoom] = useState('')
  const [teacher, setTeacher] = useState('')
  const [startTime, setStartTime] = useState('08:30')
  const [endTime, setEndTime] = useState('09:30')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!subject.trim()) { toast.error('ใส่วิชาเรียนด้วยดิเว้ย'); return }
    setLoading(true)
    const { error } = await supabase.from('schedules').insert([{
      day_of_week: day, subject_name: subject.trim(), room_number: room.trim() || null, teacher_name: teacher.trim() || null, start_time: startTime, end_time: endTime
    }])
    if (error) toast.error('เพิ่มไม่ได้ว่ะ')
    else { toast.success('เพิ่มเข้าตารางแล้ว!'); onSuccess(); onClose(); }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold text-lg">🏫 เพิ่มวิชาเรียน ({DAYS.find(d => d.key === day)?.label})</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-brand-bg"><X size={16} className="text-brand-dim" /></button>
        </div>
        <div>
          <label className="text-xs text-brand-dim font-medium">ชื่อวิชา *</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-dim font-medium">ห้องเรียน</label>
            <input type="text" value={room} onChange={e => setRoom(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs text-brand-dim font-medium">ชื่อครู</label>
            <input type="text" value={teacher} onChange={e => setTeacher(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-brand-dim font-medium">เวลาเริ่ม</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" /></div>
          <div><label className="text-xs text-brand-dim font-medium">เวลาเลิก</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full mt-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none" /></div>
        </div>
        <button onClick={handleCreate} className="w-full bg-brand-accent text-brand-bg font-semibold py-3 rounded-xl">บันทึกเข้าตาราง</button>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const { isAdmin } = useAuth()
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null) // เก็บข้อมูลคาบที่จะแก้

  const fetchSchedule = async () => {
    const { data } = await supabase.from('schedules').select('*').order('start_time', { ascending: true })
    setClasses(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchSchedule()
    const channel = supabase.channel('schedule-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => {
      fetchSchedule()
    }).subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('จะลบคาบนี้ทิ้งจริงดิ?')) return
    await supabase.from('schedules').delete().eq('id', id)
    toast.success('ลบออกแล้ว!')
  }

  const todaysClasses = classes.filter(c => c.day_of_week === selectedDay)

  return (
    <Layout>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div><h1 className="text-white text-2xl font-bold">📅 ตารางเรียนรวม</h1><p className="text-brand-dim text-sm mt-1">วันนี้เรียนอะไรบ้าง</p></div>
        {isAdmin && <button onClick={() => setShowAddModal(true)} className="p-3 bg-brand-accent text-brand-bg rounded-xl font-bold flex items-center gap-1 text-sm"><Plus size={16} /> เพิ่มคาบ</button>}
      </div>

      <div className="px-5 mb-5">
        <div className="flex bg-brand-surface border border-brand-border rounded-2xl p-1.5 justify-between gap-1">
          {DAYS.map(d => (
            <button key={d.key} onClick={() => setSelectedDay(d.key)} className={`flex-1 py-2.5 rounded-xl text-center text-xs font-semibold transition-all ${selectedDay === d.key ? 'bg-brand-accent text-brand-bg font-bold scale-105 shadow-md' : 'text-brand-dim'}`}>{d.label}</button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3 pb-6">
        {loading ? <div className="flex justify-center py-20"><Loader2 size={32} className="text-brand-accent animate-spin" /></div>
        : todaysClasses.length === 0 ? <div className="bg-brand-surface border border-brand-border rounded-2xl p-10 text-center"><p className="text-4xl mb-2">🎉</p><p className="text-brand-dim text-sm">ไม่มีเรียน หรือแอดมินยังไม่ลงตาราง</p></div>
        : todaysClasses.map(c => (
          <div key={c.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 relative overflow-hidden flex items-start gap-4">
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${DAYS.find(d => d.key === selectedDay)?.color.split(' ')[0]}`} />
            <div className="flex flex-col items-center justify-center bg-brand-bg border border-brand-border rounded-xl px-2.5 py-2 min-w-[70px]">
              <Clock size={12} className="text-brand-dim mb-1" /><span className="text-white font-bold text-xs">{c.start_time}</span><span className="text-brand-border text-[10px]">{c.end_time}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm flex items-center gap-1.5"><BookOpen size={14} className="text-brand-accent" />{c.subject_name}</h3>
              <div className="flex flex-wrap gap-x-3 text-[11px] text-brand-dim">
                {c.room_number && <span className="flex items-center gap-1"><MapPin size={10} />ห้อง {c.room_number}</span>}
                {c.teacher_name && <span className="flex items-center gap-1"><User size={10} />{c.teacher_name}</span>}
              </div>
            </div>
            
            {/* ปุ่ม แก้ไข/ลบ (เฉพาะแอดมิน) */}
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <button onClick={() => setEditingClass(c)} className="p-1.5 text-brand-dim bg-brand-bg rounded-lg active:scale-90"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-400 bg-red-500/10 rounded-lg active:scale-90"><Trash2 size={14} /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddModal && <AddClassModal day={selectedDay} onClose={() => setShowAddModal(false)} onSuccess={fetchSchedule} />}
      {editingClass && <EditClassModal classItem={editingClass} onClose={() => setEditingClass(null)} onSuccess={fetchSchedule} />}
    </Layout>
  )
}