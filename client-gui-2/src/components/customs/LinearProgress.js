import * as React from 'react'
import { Typography, Box, LinearProgress } from '@mui/material'
import { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 2,
  width: '100%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#daf5da'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 2,
    backgroundColor: theme.palette.mode === 'light' ? '#03b503' : '#308fe8'
  }
}))

const LinearProgressWithLabel = (props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
      <Box sx={{ mr: 1, flexGrow: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

export default LinearProgressWithLabel
