import * as React from 'react'
import { Box, Grid } from '@mui/material'

import LearningpathAnalysis from '../../components/Learningpath/Analysis'
import TotalLearningpath from '../../components/Learningpath/TotalLearningpath'
import TopFollowRoadmap from './TopFollowRoadmap'
import TopStarCourse from './TopStarCourse'
import TopStarRoadmap from './TopStarRoadmap'

const Learningpath = (props) => {
  return (
    <Box sx={{ height: 'calc(100vh - 130px)', overflow: 'scroll' }} >
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={4} md={7}>
          <LearningpathAnalysis />
        </Grid>
        <Grid item xs={4} sm={4} md={5}>
          <TotalLearningpath />
        </Grid>
        <Grid item xs={4} sm={8} md={4}>
          <Box
            sx={{
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
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
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
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
              boxShadow:
                'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
              p: 2,
              background: 'white',
              borderRadius: '0.625rem'
            }}>
            <TopFollowRoadmap />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
export default Learningpath
