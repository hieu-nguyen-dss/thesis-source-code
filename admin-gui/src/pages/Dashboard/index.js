import * as React from 'react'
import { Box, Grid } from '@mui/material'

import UserAnalysis from '../../components/User/Analysis'
import TotalUser from '../../components/User/TotalUser'
import AcessTimes from '../../components/AcessTimes'
import LearningpathAnalysis from '../../components/Learningpath/Analysis'
import TotalLearningpath from '../../components/Learningpath/TotalLearningpath'

import { useAdmin } from '../../contexts'

const Dashboard = (props) => {
  const { dashboardData } = useAdmin()
  return (
    <Box >
        {dashboardData && (
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={2} sm={4} md={6}>
              <UserAnalysis />
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <LearningpathAnalysis />
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <TotalUser />
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <TotalLearningpath />
            </Grid>
          </Grid>
        )}
      </Box>
  )
}
export default Dashboard
