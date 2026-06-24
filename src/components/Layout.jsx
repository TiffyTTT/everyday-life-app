import BottomNav from './BottomNav'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <main className="overflow-y-auto pb-28 scrollbar-hide">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}