import * as React from 'react'
import { Typography, Box, Grid, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useDashboard } from '../../contexts'

const TopFollowRoadmap = (props) => {
  const { t } = useTranslation('common')
  const {
    dashboardData: { topFollowRoadmap }
  } = useDashboard()
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
        {t('dashboard.top10Follow')}
      </Box>
      <Grid container>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
            {t('dashboard.courseName')}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
            {t('dashboard.followers')}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
          {t('dashboard.stars')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
        </Grid>
        {topFollowRoadmap.map((rm, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <Link to={`/my-lps/roadmaps/${rm._id}`} style={{ textDecoration: 'none' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                  {rm.roadmap.name}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                {rm.followers}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                {rm.roadmap.stars}
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
export default TopFollowRoadmap
