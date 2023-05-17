import * as React from 'react'
import { Paper, Box } from '@mui/material'
import { useAdmin } from '../../contexts'
const TotalUser = (props) => {
  const { dashboardData: data } = useAdmin()
  return (
    <Paper
      sx={{
        width: '100%',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        height: '100%',
        borderRadius: '0.75rem'
      }}>
      <Box sx={{ p: '5px', display: 'flex', height: 'calc(100% - 10px)' }}>
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            borderRight: '3px dashed grey',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
          <Box sx={{ textAlign: 'center', fontSize: 16, fontWeight: 500 }}>Total course</Box>
          <Box sx={{ fontWeight: 500, textAlign: 'center', fontSize: 32, mt: 3 }}>
            {data.totalCourse}
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
          <Box sx={{ textAlign: 'center', fontSize: 16, fontWeight: 500 }} >Total roadmaps</Box>
          <Box sx={{ fontWeight: 500, textAlign: 'center', fontSize: 32, mt: 3 }}>{data.totalRoadmap}</Box>
        </Box>
      </Box>
    </Paper>
  )
}
export default TotalUser
