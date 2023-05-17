import * as React from 'react'
import { Paper, Box } from '@mui/material'
import TimelineIcon from '@mui/icons-material/Timeline'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { useTranslation } from 'react-i18next'

import { useDashboard } from '../../contexts'

const TotalUser = (props) => {
  const { t } = useTranslation('common')
  const { dashboardData: data } = useDashboard()
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%'
      }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box
          sx={{
            color: 'orange',
            flexGrow: 1,
            p: 2,
            mr: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '0.75rem',
            background: 'white'
          }}>
          <Box sx={{ textAlign: 'center', mb: 3 }} >
            <TrackChangesIcon sx={{ textAlign: 'center', width: 60, height: 60 }} />
          </Box>
          <Box sx={{ textAlign: 'center', fontSize: 16 }}>{t('dashboard.totalCourse')}</Box>
          <Box sx={{ fontWeight: 500, textAlign: 'center', fontSize: 32, mt: 3 }}>
            {data.totalCourse}
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            color: '#93d042',
            p: 2,
            ml: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '0.75rem',
            background: 'white'
          }}>
          <Box sx={{ textAlign: 'center', mb: 3 }} >
            <TimelineIcon sx={{ textAlign: 'center', width: 60, height: 60 }} />
          </Box>
          <Box sx={{ textAlign: 'center', fontSize: 16 }} >{t('dashboard.totalRoadmap')}</Box>
          <Box sx={{ fontWeight: 500, textAlign: 'center', fontSize: 32, mt: 3 }}>{data.totalRoadmap}</Box>
        </Box>
      </Box>
    </Box>
  )
}
export default TotalUser
