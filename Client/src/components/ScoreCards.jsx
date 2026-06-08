export const subjects = [
  { key: 'math', label: 'Toán', type: 'Bắt buộc' },
  { key: 'literature', label: 'Ngữ văn', type: 'Bắt buộc' },
  { key: 'english', label: 'Ngoại ngữ', type: 'Bắt buộc' },
  { key: 'physics', label: 'Vật lý', type: 'Tự chọn' },
  { key: 'chemistry', label: 'Hóa học', type: 'Tự chọn' },
  { key: 'biology', label: 'Sinh học', type: 'Tự chọn' },
  { key: 'history', label: 'Lịch sử', type: 'Tự chọn' },
  { key: 'geography', label: 'Địa lý', type: 'Tự chọn' },
  { key: 'civic_education', label: 'GDCD', type: 'Tự chọn' },
]

const cardStyles = [
  'border-sky-500/25 bg-[#15324a]',
  'border-blue-500/25 bg-[#1c2f5a]',
  'border-cyan-500/25 bg-[#123945]',
  'border-indigo-500/25 bg-[#262d5f]',
  'border-teal-500/25 bg-[#123d3a]',
  'border-emerald-500/25 bg-[#173f33]',
]

function ScoreCards({ student }) {
  const visibleSubjects = student
    ? subjects
        .map((subject) => ({ ...subject, score: student[subject.key] }))
        .filter((subject) => subject.score !== null && subject.score !== undefined)
    : subjects.filter((subject) => subject.type === 'Bắt buộc')

  return (
    <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
      {visibleSubjects.map((subject, index) => (
        <article
          className={`min-h-[150px] rounded-lg border p-[22px] shadow-sm ${
            cardStyles[index % cardStyles.length]
          }`}
          key={subject.key}
        >
          <span className="font-extrabold text-slate-300">{subject.type}</span>
          <h3 className="mt-[22px] mb-2.5 text-[21px] font-extrabold text-white">
            {subject.label}
          </h3>
          <strong
            className={
              student
                ? 'text-[34px] leading-none font-black text-white'
                : 'text-base font-extrabold text-slate-300'
            }
          >
            {student ? subject.score : 'Nhập SBD'}
          </strong>
        </article>
      ))}
    </div>
  )
}

export default ScoreCards
