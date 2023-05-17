import * as React from 'react'
import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'

import Tree from './Tree'

const Outcomes = (props) => {
  const { state } = useLocation()
  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        background: 'white',
        borderRadius: 3,
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'scroll'
      }}>
      <Tree data={state ? state.passData : null} />
    </Box>
  )
}
export default Outcomes
