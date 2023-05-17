import * as React from 'react'
import { Box, Grid } from '@mui/material'

import UserAnalysis from '../../components/User/Analysis'
import TotalUser from '../../components/User/TotalUser'
import TopRoadmapStar from './TopRoadmapStar'
import ListTeachers from './ListTeachers'
import ListStudents from './ListStudents'
import TopCourseStar from './TopCourseStar'
import AdminAcc from './AdminAcc'

import { useAdmin } from '../../contexts'

const User = (props) => {
  const { dashboardData: data } = useAdmin()
  return (
    <Box sx={{ height: 'calc(100vh - 130px)', overflow: 'scroll' }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={2} sm={4} md={7}>
          <UserAnalysis />
        </Grid>
        <Grid item xs={2} sm={4} md={5}>
          <Box
            sx={{
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
              p: 2,
              background: 'white',
              borderRadius: '0.625rem'
            }}>
            <AdminAcc />
          </Box>
        </Grid>
        <Grid item xs={2} sm={4} md={6}>
          <Box
            sx={{
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
              p: 2,
              background: 'white',
              borderRadius: '0.625rem'
            }}>
            <ListTeachers />
          </Box>
        </Grid>
        <Grid item xs={2} sm={4} md={6}>
          <Box
            sx={{
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
              p: 2,
              background: 'white',
              borderRadius: '0.625rem'
            }}>
            <ListStudents />
          </Box>
        </Grid>
        <Grid item xs={2} sm={4} md={6}>
          <Box
            sx={{
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
              p: 2,
              background: 'white',
              borderRadius: '0.625rem'
            }}>
            <TopRoadmapStar />
          </Box>
        </Grid>
        <Grid item xs={2} sm={4} md={6}>
          <Box
            sx={{
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
              p: 2,
              background: 'white',
              borderRadius: '0.625rem'
            }}>
            <TopCourseStar />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
export default User
