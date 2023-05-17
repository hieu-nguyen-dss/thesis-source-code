import * as React from 'react'
import { Box, Button, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import TimelineIcon from '@mui/icons-material/Timeline'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import { useTranslation } from 'react-i18next'

const Filter = (props) => {
  const { filter, currentFilter, totalRm, totalLp, deleteFilter } = props
  const { t } = useTranslation('common')
  const roadmapOnly = () => {
    filter('type', 'roadmap')
  }
  const courseOnly = () => {
    filter('type', 'course')
  }
  const descStar = () => {
    filter('star', 'desc')
  }

  return (
    <Box sx={{ mt: 2, mb: 2, textAlign: 'right' }}>
      <Button
        size="small"
        startIcon={<TimelineIcon />}
        onClick={roadmapOnly}
        sx={{
          m: 1,
          border: '1px solid #3fb929',
          textTransform: 'none',
          color: '#3fb929',
          background: currentFilter.type === 'roadmap' ? 'rgb(115 255 139 / 20%)' : 'white'
        }}>
        <Typography sx={{ fontWeight: 500, mr: 2, fontSize: 13 }}>{t('discovery.roadmap')}</Typography>
        <Typography
          sx={{
            fontSize: 14,
            px: 1,
            borderRadius: 1,
            color:
              currentFilter.type === 'roadmap' ? 'white' : '#3fb929',
            backgroundColor:
              currentFilter.type === 'roadmap'
                ? '#279907'
                : 'rgb(57 210 25 / 30%)'
          }}>
          {totalRm}
        </Typography>
      </Button>
      <Button
        size="small"
        onClick={courseOnly}
        sx={{
          fontSize: 13,
          m: 1,
          border: '1px solid #ff9900',
          textTransform: 'none',
          color: '#ff9900',
          background: currentFilter.type === 'course' ? 'rgb(255 141 0 / 12%)' : 'white'
        }}
        startIcon={<TrackChangesIcon />}>
        <Typography sx={{ fontWeight: 500, mr: 2, fontSize: 13 }}>{t('discovery.course')}</Typography>
        <Typography
          sx={{
            fontSize: 13,
            px: 1,
            borderRadius: 1,
            fontweight: 500,
            color:
              currentFilter.type === 'course' ? 'white' : '#ff9900',
            backgroundColor:
              currentFilter.type === 'course'
                ? '#ff9900'
                : 'rgb(255 129 9 / 26%)'
          }}>
          {totalLp}
        </Typography>
      </Button>
      <Button
        size="small"
        variant='outlined'
        onClick={descStar}
        sx={{
          fontSize: 13,
          m: 1,
          textTransform: 'none'
        }}
        startIcon={<StarIcon />}>
        {t('discovery.mostStar')}
      </Button>
      <Button
        size="small"
        variant='outlined'
        onClick={deleteFilter}
        sx={{
          fontSize: 13,
          m: 1,
          mr: 0,
          textTransform: 'none'
        }}
        startIcon={<FilterAltOffIcon />}>
        {t('discovery.deleteFilter')}
      </Button>
    </Box>
  )
}
export default Filter
