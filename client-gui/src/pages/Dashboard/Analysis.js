import * as React from 'react'
import { Paper } from '@mui/material'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { useDashboard } from '../../contexts'

ChartJS.register(
  Title,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

const Analysis = (props) => {
  const { t } = useTranslation('common')
  const { dashboardData: { totalLpTimeSr } } = useDashboard()
  return (
    <Paper
      sx={{
        // width: '100%',
        height: '300px',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        borderRadius: '0.75rem',
        background:
          'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))'
      }}>
      <Line
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'white',
                boxWidth: 50,
                boxHeight: 0,
                font: {
                  size: 14,
                  weight: 400
                }
              }
            },
            title: {
              display: true,
              text: t('dashboard.name'),
              font: {
                size: 15,
                weight: 500
              },
              color: 'white'
            }
          },
          interaction: {
            intersect: false
          },
          scales: {
            y: {
              grid: {
                drawBorder: false,
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5],
                color: 'rgba(255, 255, 255, .2)'
              },
              ticks: {
                display: true,
                color: '#f8f9fa',
                padding: 10,
                font: {
                  size: 14,
                  weight: 300,
                  family: 'Roboto',
                  style: 'normal',
                  lineHeight: 2
                }
              }
            },
            x: {
              title: {
                text: 'Time'
              },
              grid: {
                drawBorder: false,
                display: false,
                drawOnChartArea: false,
                drawTicks: false,
                borderDash: [5, 5],
                color: 'rgba(255, 255, 255, .2)'
              },
              ticks: {
                display: true,
                color: '#f8f9fa',
                padding: 10,
                font: {
                  size: 14,
                  weight: 300,
                  family: 'Roboto',
                  style: 'normal',
                  lineHeight: 2
                }
              }
            }
          }
        }}
        data={{
          labels: totalLpTimeSr.map(item => new Date(item.timestamp).getMinutes()),
          datasets: [
            {
              label: t('dashboard.totalCourse'),
              pointBackgroundColor: 'orange',
              data: totalLpTimeSr.map(item => item.totalCourses),
              borderColor: 'orange',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            },
            {
              label: t('dashboard.totalRoadmap'),
              pointBackgroundColor: '#93d042',
              data: totalLpTimeSr.map(item => item.totalRoadmaps),
              borderColor: '#93d042',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }
          ]
        }}
      />
    </Paper>
  )
}
export default Analysis
