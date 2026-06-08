const tabs = [
  { id: 'search', label: 'Tra cứu SBD' },
  { id: 'chart', label: 'Biểu đồ điểm' },
  { id: 'top', label: 'Top 10' },
]

function AppNavigation({ activeTab, onTabChange }) {
  return (
    <nav
      className="mx-auto flex w-[min(1100px,calc(100%-32px))] gap-2 rounded-lg border border-slate-600/50 bg-[#111827] p-2 shadow-sm max-md:grid max-md:grid-cols-1"
      aria-label="Chọn chức năng"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            className={`min-h-11 flex-1 rounded-md border-0 px-4 font-extrabold transition ${
              isActive
                ? 'bg-sky-500 text-white'
                : 'bg-[#1f2937] text-slate-200 hover:bg-[#273449] hover:text-white'
            }`}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

export default AppNavigation
