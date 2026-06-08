import { useEffect, useState } from 'react'
import { getTopStudents } from '../services/api'

function TopStudents() {
  const [topStudents, setTopStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadTopStudents = async () => {
      try {
        const result = await getTopStudents()
        setTopStudents(result.data)
      } catch {
        setMessage('Không thể tải danh sách top 10.')
      } finally {
        setLoading(false)
      }
    }

    loadTopStudents()
  }, [])

  return (
    <section className="mt-[26px]">
      <div className="mb-[18px] flex items-end justify-between gap-4 max-md:grid max-md:grid-cols-1">
        <span className="text-[26px] font-black text-white">
          Top 10 thí sinh khối A
        </span>
        <strong className="text-slate-300">Toán + Vật lý + Hóa học</strong>
      </div>

      {loading && (
        <p className="my-[18px] font-bold text-slate-300">
          Đang tải danh sách...
        </p>
      )}
      {message && <p className="mt-3 font-extrabold text-rose-300">{message}</p>}

      {!loading && (
        <div className="overflow-x-auto rounded-lg border border-slate-600/50 bg-[#111827] shadow-sm">
          <table className="w-full min-w-[680px] border-collapse">
            <thead className="bg-[#1f2937]">
              <tr>
                {['Hạng', 'Số báo danh', 'Toán', 'Vật lý', 'Hóa học', 'Tổng'].map(
                  (heading) => (
                    <th
                      className="border-b border-slate-700 p-4 text-left text-sm font-extrabold text-slate-300"
                      key={heading}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {topStudents.map((item, index) => (
                <tr className="hover:bg-[#1f2937]" key={item._id || item.registration_number}>
                  <td className="border-b border-slate-700 p-4 font-bold text-white">
                    {index + 1}
                  </td>
                  <td className="border-b border-slate-700 p-4 font-bold text-white">
                    {item.registration_number}
                  </td>
                  <td className="border-b border-slate-700 p-4 font-bold text-white">
                    {item.math ?? '-'}
                  </td>
                  <td className="border-b border-slate-700 p-4 font-bold text-white">
                    {item.physics ?? '-'}
                  </td>
                  <td className="border-b border-slate-700 p-4 font-bold text-white">
                    {item.chemistry ?? '-'}
                  </td>
                  <td className="border-b border-slate-700 p-4 font-bold text-white">
                    {item.totalGroupA ?? '-'}
                  </td>
                </tr>
              ))}
              {topStudents.length === 0 && (
                <tr>
                  <td className="p-4 font-bold text-white" colSpan="6">
                    Chưa có dữ liệu. Hãy chạy import CSV trước.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default TopStudents
