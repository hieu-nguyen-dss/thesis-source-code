import * as React from 'react'
import { Box, Grid, Typography, Divider } from '@mui/material'
import { useAdmin } from '../../contexts'
const UserList = (props) => {
  const { dashboardData: data } = useAdmin()
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
        Top users with the most course stars{' '}
      </Box>
      <Grid container alignItems={'stretch'} columns={{ md: 16 }}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
            NAME
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
            EMAIL
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
            AMOUNT COURSE STARS
          </Typography>
        </Grid>
        <Grid item xs={16}>
          <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
        </Grid>
        {data.topStarLpUser.map((user, index) => (
          <React.Fragment key={index}>
            <Grid item xs={4}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                {user.owner.name}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                {user.owner.email}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgb(52, 71, 103)' }}>
                {user.count}
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
