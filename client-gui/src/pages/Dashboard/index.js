import * as React from 'react'
import { Box, Grid } from '@mui/material'

import LearningpathAnalysis from './Analysis'
import TotalLearningpath from './TotalLearningpath'
import TopFollowRoadmap from './TopFollowRoadmap'
import TopStarCourse from './TopStarCourse'
import TopStarRoadmap from './TopStarRoadmap'
import TopCourseStar from './TopCourseStar'
import TopRoadmapStar from './TopRoadmapStar'

import { useDocumentTitle, useBreadcrumb } from '../../contexts'

const Dashboard = (props) => {
  const { setTitle } = useDocumentTitle()
  const { handleAddBreadcrumb } = useBreadcrumb()
  React.useEffect(() => {
    handleAddBreadcrumb('/', 'Dashboard')
    setTitle('Dashboard')
  }, [])
  return (
    <Box sx={{ mt: 2 }}>
      <Box>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={4} sm={4} md={7}>
            <LearningpathAnalysis />
          </Grid>
          <Grid item xs={4} sm={4} md={5}>
            <TotalLearningpath />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 3 }} >
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={4} sm={8} md={4}>
            <Box
              sx={{
                p: 2,
                background: 'white',
                borderRadius: '0.625rem'
              }}>
              <TopStarCourse />
            </Box>
          </Grid>
          <Grid item xs={4} sm={8} md={4}>
            <Box
              sx={{
                p: 2,
                background: 'white',
                borderRadius: '0.625rem'
              }}>
              <TopStarRoadmap />
            </Box>
          </Grid>
          <Grid item xs={4} sm={8} md={4}>
            <Box
              sx={{
                p: 2,
                background: 'white',
                borderRadius: '0.625rem'
              }}>
              <TopFollowRoadmap />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={4} sm={8} md={6}>
            <Box
              sx={{
                p: 2,
                background: 'white',
                borderRadius: '0.625rem'
              }}>
              <TopCourseStar />
            </Box>
          </Grid>
          <Grid item xs={4} sm={8} md={6}>
            <Box
              sx={{
                p: 2,
                background: 'white',
                borderRadius: '0.625rem'
              }}>
              <TopRoadmapStar />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
export default Dashboard
