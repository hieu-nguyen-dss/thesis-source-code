import * as React from 'react'
import {
  Box,
  Button,
  Dialog
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

const ButtonBound = (props) => {
  const { icon, title, detail, link, passData } = props
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <Box
        sx={{
          color: '#6c68f3',
          background: 'white',
          border: '1px solid #F7F8F9',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
          m: 2,
          mt: 0,
          flexGrow: 1,
          borderRadius: '12px',
          '&:hover': {
            background:
              'linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(64,60,239,1) 0%, rgba(160,157,244,1) 100%)',
            color: 'white'
          }
        }}>
        <Box sx={{ p: 5, textAlign: 'center' }}>{icon}</Box>
        <Box sx={{ height: 130 }} >
          <Box sx={{ fontSize: 20, textAlign: 'center' }}>{title}</Box>
          <Box sx={{ fontSize: 14, textAlign: 'center', m: 1 }}>More information</Box>
          {props.moreInfo && props.moreInfo}
        </Box>
        <Box sx={{ textAlign: 'center', pb: 2 }}>
          <Button
            onClick={() => navigate(link, { state: { passData } })}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              '&:hover': { background: '#fff' }
            }}>
            View
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  )
}
export default ButtonBound
