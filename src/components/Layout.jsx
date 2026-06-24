import BottomNav from './BottomNav'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}