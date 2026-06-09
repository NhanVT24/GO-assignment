import { useState } from 'react'
import ScoreCards from '../components/ScoreCards'
import { getScoreByRegistrationNumber } from '../services/api'

function ScoreLookup() {
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [student, setStudent] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (event) => {
    event.preventDefault()
    const value = registrationNumber.trim()

    if (!value) {
      setMessage('Vui lòng nhập số báo danh.')
      setStudent(null)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const result = await getScoreByRegistrationNumber(value)
      setStudent(result.data)
    } catch (error) {
      setStudent(null)
      setMessage(
        error.response?.data?.message || 'Không thể tra cứu điểm lúc này.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form
        className="rounded-lg border border-slate-600/50 bg-[#111827] p-[26px] shadow-sm"
        onSubmit={handleSearch}
      >
        <label
          className="mb-2.5 block font-extrabold text-slate-200"
          htmlFor="registrationNumber"
        >
          Số báo danh
        </label>
        <div className="grid grid-cols-[1fr_140px] gap-3 max-md:grid-cols-1">
          <input
            className="min-h-[52px] w-full rounded-md border border-slate-600 bg-[#1f2937] px-4 text-white outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-3 focus:ring-sky-400/20"
            id="registrationNumber"
            inputMode="numeric"
            onChange={(event) => setRegistrationNumber(event.target.value)}
            placeholder="Ví dụ: 01000001"
            value={registrationNumber}
          />
          <button
            className="min-h-[52px] rounded-md bg-sky-500 px-4 font-black text-white transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-70"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Đang tra...' : 'Tra cứu'}
          </button>
        </div>
        {message && <p className="mt-3 font-extrabold text-rose-300">{message}</p>}
      </form>

      <section className="mt-[26px]">
        <div className="mb-[18px] flex items-end justify-between gap-4 max-md:grid max-md:grid-cols-1">
          <div>
            <span className="text-[26px] font-black text-white">
              Kết quả các môn thi
            </span>
            {student?.foreign_language_code && (
              <p className="mt-1 font-bold text-slate-300">
                Mã ngoại ngữ: {student.foreign_language_code}
              </p>
            )}
          </div>
          {student && (
            <strong className="text-slate-300">
              SBD {student.registration_number}
            </strong>
          )}
        </div>
        <ScoreCards student={student} />
      </section>
    </div>
  )
}

export default ScoreLookup
