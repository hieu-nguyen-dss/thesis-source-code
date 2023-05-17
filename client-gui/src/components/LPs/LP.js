import * as React from 'react'
import { Box, Button, IconButton } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorderRounded'
import StarIcon from '@mui/icons-material/StarRounded'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const LP = (props) => {
  const { name, id, public: isPublic, youStarred, stars } = props.data
  const { icon } = props
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation('common')
  const handleClick = () => {
    navigate(`${pathname}/courses/${id}`)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        color: '#6c68f3',
        background: 'white',
        m: 1,
        mt: 0,
        borderRadius: 2,
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        textAlign: 'right'
      }}>
      <Box sx={{ position: 'absolute', right: 3, top: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ fontSize: 14 }}>{stars}</Box>
          {youStarred && <StarIcon sx={{ width: 20, height: 20, color: '#9e04ff' }} />}
          {!youStarred && <StarBorderIcon sx={{ width: 20, height: 20, color: '#9e04ff' }} />}
        </Box>
        {isPublic && <PublicIcon sx={{ width: 20, height: 20, color: '#9e04ff' }} />}
        {!isPublic && <LockIcon sx={{ width: 20, height: 20, color: '#9e04ff' }} />}
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          pt: 3
        }}>
        <img src={icon} width={100} height={100} />
      </Box>
      <Box sx={{}}>
        <Box sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center', my: 1 }}>{name}</Box>
      </Box>
      <Box sx={{ textAlign: 'center', pb: 2 }}>
        <Button
          onClick={handleClick}
          size="small"
          sx={{
            textTransform: 'none',
            color: '#6c68f3',
            background: 'white',
            border: '2px solid #6c68f3',
            '&:hover': { background: '#fff' }
          }}>
          {t('learningPath.view')}
        </Button>
      </Box>
    </Box>
  )
}
export default LP
