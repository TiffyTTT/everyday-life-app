import Layout from '../components/Layout'
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react'

export default function FinancePage() {
  // Placeholder data — จะเชื่อม Supabase ใน Step ถัดไป
  const summary = [
    { label: 'งบเดือนนี้',  value: '฿0',   icon: Wallet,       color: 'text-brand-warn',   bg: 'bg-amber-50'  },
    { label: 'ใช้ไปแล้ว',  value: '฿0',   icon: TrendingDown, color: 'text-brand-danger', bg: 'bg-red-50'    },
    { label: 'คงเหลือ',    value: '฿0',   icon: PiggyBank,    color: 'text-brand-sage',   bg: 'bg-emerald-50'},
  ]

  return (
    <Layout>
      <div className="px-4 pt-14 pb-4 animate-fade-in">

        {/* Header */}
        <div className="mb-6 animate-fade-up">
          <h1 className="text-brand-text text-2xl font-bold tracking-tight">💰 การเงิน</h1>
          <p className="text-brand-dim text-sm mt-1">สรุปรายรับ-รายจ่ายของฉัน</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up delay-100">
          {summary.map(({ label, value, icon: Icon, color, bg }) => {
            let glowClass = ''
            if (color === 'text-brand-warn') glowClass = 'glow-amber'
            else if (color === 'text-brand-danger') glowClass = 'glow-red'
            else if (color === 'text-brand-sage') glowClass = 'glow-sage'

            return (
              <div key={label} className={`${bg} rounded-3xl p-3 shadow-card text-center animate-scale-in ${glowClass}`}>
                <Icon size={18} className={`${color} mx-auto mb-1.5`} />
                <p className={`${color} font-bold text-lg leading-none`}>{value}</p>
                <p className="text-brand-muted text-[10px] mt-1">{label}</p>
              </div>
            )
          })}
        </div>

        {/* Recent Transactions */}
        <div className="bg-brand-surface rounded-3xl shadow-card p-4 mb-4 animate-fade-up delay-200 glow-purple">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-brand-text font-semibold">รายการล่าสุด</h2>
            <TrendingUp size={16} className="text-brand-sage" />
          </div>
          <div className="flex flex-col items-center py-6">
            <p className="text-4xl mb-2">🐖</p>
            <p className="text-brand-dim text-sm font-medium">ยังไม่มีรายการ</p>
            <p className="text-brand-dim/60 text-xs mt-1">ฟีเจอร์นี้กำลังจะมา!</p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-brand-purple-light to-brand-sage-light rounded-3xl p-4 border border-brand-purple/20 animate-fade-up delay-300 glow-purple">
          <p className="text-brand-purple font-semibold text-sm mb-1">🚧 Coming Soon</p>
          <p className="text-brand-dim text-xs leading-relaxed">
            ระบบบันทึกรายรับ-รายจ่าย, ตั้งงบประจำเดือน และสรุปค่าใช้จ่ายรายสัปดาห์
          </p>
        </div>

      </div>
    </Layout>
  )
}