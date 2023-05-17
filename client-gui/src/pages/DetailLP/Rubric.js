import * as React from 'react'
import { Box, Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import rubricIcon from '../../assets/flaticon/exam.png'

const Rubric = (props) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <Button
      onClick={() => navigate(`${pathname}/rubrics`, { state: { passData: props.rubrics } })}
      sx={{
        color: '#6c68f3',
        background: 'white',
        fontWeight: 500,
        border: '1px solid #F7F8F9',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
        m: 2,
        mt: 0,
        flexGrow: 1,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <img src={rubricIcon} width="130" height="130" />
      </Box>
      <Box sx={{ fontSize: 14, textAlign: 'center' }}>Rubrics</Box>
    </Button>
  )
}
export default Rubric
