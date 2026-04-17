'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#0f172a',
      titleColor: '#94a3b8',
      bodyColor: '#f1f5f9',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 10,
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 10,
        },
      },
    },
  },
}

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Solar Generation (kWh)',
      data: [320, 450, 480, 520, 610, 580, 640],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
    },
  ],
}

export default function SavingsChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Line options={options} data={data} />
    </div>
  )
}
