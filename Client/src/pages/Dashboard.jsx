import { useEffect, useState } from 'react'
import ChartSection, { scoreLevels } from '../components/ChartSection'
import { getScoreStatistics } from '../services/api'

function Dashboard() {
  const [statistics, setStatistics] = useState([])
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const result = await getScoreStatistics()
        setStatistics(result.data)
      } catch {
        setMessage('Không thể tải dữ liệu biểu đồ.')
      } finally {
        setLoading(false)
      }
    }

    loadStatistics()
  }, [])

  return (
    <section className="mt-[26px]">
      <div className="mb-[18px] flex items-end justify-between gap-4 max-md:grid max-md:grid-cols-1">
        <div>
          <span className="text-[26px] font-black text-white">
            Feature report
          </span>
          <p className="mt-1 font-bold text-slate-300">
            Thống kê số lượng thí sinh theo từng mức điểm và từng môn
          </p>
        </div>

        {selectedLevel && (
          <button
            className="min-h-11 rounded-md bg-slate-700 px-4 font-extrabold text-white transition hover:bg-slate-600"
            onClick={() => setSelectedLevel(null)}
            type="button"
          >
            Quay lại biểu đồ tổng
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2.5 max-md:grid-cols-1">
        {scoreLevels.map((level) => {
          const isSelected = selectedLevel === level.value

          return (
            <button
              className={`min-h-[46px] rounded-md border p-3 text-center font-extrabold shadow-sm transition ${
                isSelected
                  ? 'border-sky-300 bg-sky-500 text-white'
                  : 'border-slate-600/50 bg-[#111827] text-slate-100 hover:border-sky-400 hover:bg-[#1f2937]'
              }`}
              key={level.value}
              onClick={() => setSelectedLevel(level.value)}
              type="button"
            >
              {level.label}
            </button>
          )
        })}
      </div>

      {loading && (
        <p className="my-[18px] font-bold text-slate-300">
          Đang tải biểu đồ...
        </p>
      )}
      {message && <p className="mt-3 font-extrabold text-rose-300">{message}</p>}
      {!loading && statistics.length > 0 && (
        <ChartSection selectedLevel={selectedLevel} statistics={statistics} />
      )}
    </section>
  )
}

export default Dashboard
