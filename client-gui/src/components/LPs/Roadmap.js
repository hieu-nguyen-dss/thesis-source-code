import * as React from 'react'
import { Box, Button, IconButton } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorderRounded'
import StarIcon from '@mui/icons-material/StarRounded'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { roadmapApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'

const Roadmap = (props) => {
  const { name, id, stars, youStarred } = props.data
  const { icon } = props
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const handleClick = () => {
    navigate(`/my-lps/roadmaps/${id}`)
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
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'all 0.1s ease-in',
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
        }
      }}>
      <Box sx={{ position: 'absolute', right: 3, top: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ fontSize: 13 }}>{stars}</Box>
          {youStarred && <StarIcon sx={{ width: 20, height: 20, color: '#9e04ff' }} />}
          {!youStarred && <StarBorderIcon sx={{ width: 20, height: 20, color: '#9e04ff' }} />}
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          pt: 3
        }}>
        <img src={icon} width={100} height={100} />
      </Box>
      <Box sx={{}}>
        <Box sx={{ fontSize: 14, fontWeight: 500, my: 1, textAlign: 'center' }}>{name}</Box>
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
export default Roadmap
