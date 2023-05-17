import * as React from 'react'
import { Box, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CustomMenuItem = styled(Box)(() => ({
  // boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px',
  padding: '7px',
  borderRadius: 15,
  width: 300,
  height: 300,
  margin: '20px',
  backgroundColor: 'white',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'all 0.1s ease-in',
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
  }
}))
const MenuItem = (props) => {
  const {
    data: { link, name, description },
    icon
  } = props
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <CustomMenuItem>
        <Box
          sx={{
            textAlign: 'center',
            pt: 3
          }}>
          <img src={icon} width={150} height={150} />
        </Box>
        <Box sx={{ height: 100 }}>
          <Box sx={{ fontSize: 24, textAlign: 'center' }}>{t(name)}</Box>
          <Box sx={{ fontSize: 16, textAlign: 'center', m: 1 }}>{t(description)}</Box>
          {props.moreInfo && props.moreInfo}
        </Box>
      </CustomMenuItem>
    </Link>
  )
}
export default MenuItem
