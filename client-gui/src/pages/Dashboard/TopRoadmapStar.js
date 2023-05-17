import * as React from 'react'
import { Box, Grid, Typography, Divider, Avatar } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import vars from '../../config/vars'
import { useDashboard } from '../../contexts'
const UserList = (props) => {
  const { dashboardData: { topStarRoadmapUser } } = useDashboard()
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
        {t('dashboard.top10UserRoadmap')}
      </Box>
      <Grid container columns={{ md: 16 }}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
          {t('dashboard.courseName')}
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
            Email
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'lightslategray' }}>
          {t('dashboard.totalStars')}
          </Typography>
        </Grid>
        <Grid item xs={16}>
          <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
        </Grid>
        {topStarRoadmapUser?.map((user, index) => (
          <React.Fragment key={index}>
          <Grid item xs={6}>
            <Link style={{ display: 'flex', textDecoration: 'none', alignItems: 'center' }} to={`/profile/${user?._id}`}>
              <Avatar
                alt={user?.owner?.name}
                src={`${vars.server}/resources/avatars/${user._id}/64x64${user?.owner?.avatar}`}
              />
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme => theme.palette.primary.main, ml: 1 }}>
                {user?.owner?.name}
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
              {user?.owner?.email}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
              {user?.count}
            </Typography>
          </Grid>
          <Grid item xs={16}>
            <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
          </Grid>
        </React.Fragment>
        ))}
      </Grid>
    </Box>
  )
}
export default UserList
