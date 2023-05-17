import * as React from 'react'
import { Paper, Typography, Box, Grid, Divider } from '@mui/material'

import { useAdmin } from '../../contexts'

const TopFollowRoadmap = (props) => {
  const {
    dashboardData: { topFollowRoadmap }
  } = useAdmin()
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 2,
          color: 'lightslategray',
          textTransform: 'uppercase',
          fontWeight: 500,
          fontSize: 13
        }}>
        Top 10 followed roadmaps
      </Box>
      <Grid container>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'lightslategray' }}>
            NAME
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'lightslategray' }}>
            FOLLOWS
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'lightslategray' }}>
            STARS
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
        </Grid>
        {topFollowRoadmap.map((rm, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                {rm.roadmap.name}
              </Typography>
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
