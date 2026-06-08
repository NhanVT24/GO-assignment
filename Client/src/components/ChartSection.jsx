import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

export const scoreLevels = [
  { value: '>= 8', label: '>= 8 điểm' },
  { value: '6 - < 8', label: '6 - < 8 điểm' },
  { value: '4 - < 6', label: '4 - < 6 điểm' },
  { value: '< 4', label: '< 4 điểm' },
]

const barColors = ['#38bdf8', '#60a5fa', '#93c5fd', '#f97316']
const pieColors = [
  '#38bdf8',
  '#60a5fa',
  '#818cf8',
  '#22d3ee',
  '#2dd4bf',
  '#34d399',
  '#fbbf24',
  '#fb7185',
  '#c084fc',
]

function getRangeCount(subject, level) {
  const range = subject.ranges.find((item) => item.range === level)
  return range?.count || 0
}

function ChartSection({ statistics, selectedLevel }) {
  const labels = statistics.map((item) => item.label)

  const barData = {
    labels,
    datasets: scoreLevels.map((level, index) => ({
      label: level.value,
      data: statistics.map((subject) => getRangeCount(subject, level.value)),
      backgroundColor: barColors[index],
      borderRadius: 4,
    })),
  }

  const pieData = selectedLevel
    ? {
        labels,
        datasets: [
          {
            label: selectedLevel,
            data: statistics.map((subject) => getRangeCount(subject, selectedLevel)),
            backgroundColor: pieColors,
            borderColor: '#111827',
            borderWidth: 2,
          },
        ],
      }
    : null

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'Rubik',
            weight: 700,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label || context.dataset.label}: ${context.formattedValue} thí sinh`,
        },
      },
    },
  }

  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        ticks: {
          color: '#cbd5e1',
          font: {
            family: 'Rubik',
            weight: 700,
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#cbd5e1',
          precision: 0,
          font: {
            family: 'Rubik',
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
        },
      },
    },
  }

  return (
    <div className="mt-[18px] rounded-lg border border-slate-600/50 bg-[#111827] p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-black text-white">
          {selectedLevel
            ? `Biểu đồ tròn mức ${selectedLevel}`
            : 'Biểu đồ tổng theo 4 mức điểm'}
        </h2>
        <p className="mt-1 font-semibold text-slate-300">
          {selectedLevel
            ? 'Tỷ lệ số lượng thí sinh theo từng môn trong mức điểm đã chọn.'
            : 'So sánh số lượng thí sinh ở cả 4 mức điểm theo từng môn.'}
        </p>
      </div>

      <div className="h-[440px] max-md:h-[360px]">
        {selectedLevel ? (
          <Pie data={pieData} options={commonOptions} />
        ) : (
          <Bar data={barData} options={barOptions} />
        )}
      </div>
    </div>
  )
}

export default ChartSection
