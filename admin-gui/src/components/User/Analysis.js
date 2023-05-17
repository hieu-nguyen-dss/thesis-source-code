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

import { analysisApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'
import { useAdmin } from '../../contexts'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
)

const Analysis = (props) => {
  const { dashboardData: data } = useAdmin()
  return (
    <Paper
      sx={{
        width: '100%',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        borderRadius: '0.75rem',
        background: 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))',
        color: 'white'
      }}>
      <Line
        options={{
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            },
            title: {
              display: true,
              text: 'User analysis',
              font: {
                size: 14
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
                  lineHeight: 3
                }
              }
            },
            x: {
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
            }
          }
        }}
        data={{
          labels: data.totalUserTimeSr.map(u => new Date(u.timestamp).getMinutes()),
          datasets: [
            {
              label: 'users',
              pointBackgroundColor: 'white',
              data: data.totalUserTimeSr.map(u => u.totalUsers),
              borderColor: 'white',
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
