import * as React from 'react'
import { Paper, Typography, Box, Grid, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useDashboard } from '../../contexts'

const TopStarCourse = (props) => {
  const {
    dashboardData: { topStarCourse }
  } = useDashboard()
  const { t } = useTranslation('common')
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 2,
          color: 'lightslategray',
          textTransform: 'uppercase',
          fontWeight: 500,
          fontSize: 14
        }}>
        {t('dashboard.top10Course')}
      </Box>
      <Grid container>
        <Grid item xs={8}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
            {t('dashboard.courseName')}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
            {t('dashboard.stars')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
        </Grid>
        {topStarCourse.map((rm, index) => (
          <React.Fragment key={index}>
            <Grid item xs={8}>
              <Link style={{ textDecoration: 'none' }} to={`/my-lps/courses/${rm.id}`} >
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                  {rm.name}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={4}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                {rm.stars}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  )
}
export default TopStarCourse
