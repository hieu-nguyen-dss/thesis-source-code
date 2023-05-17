import * as React from 'react'
import { Paper, Box } from '@mui/material'
import { useAdmin } from '../../contexts'
const TotalUser = (props) => {
  const { dashboardData: data } = useAdmin()
  const totalUsers = data.totalUserTimeSr[data.totalUserTimeSr.length - 1].totalUsers
  return (
    <Paper
      sx={{
        width: '100%',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        height: '100%',
        borderRadius: '0.75rem'
      }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center', fontWeight: 500 }} >Total users</Box>
        <Box sx={{ textAlign: 'center', fontSize: 32, fontWeight: 500, mt: 4 }} >{totalUsers}</Box>
      </Box>
    </Paper>
  )
}
export default TotalUser
