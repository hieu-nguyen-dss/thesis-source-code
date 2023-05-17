import * as React from 'react'
import { Box, Card, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import StarBorderIcon from '@mui/icons-material/StarRounded'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'

const LP = (props) => {
  const { name, stars, id, public: isPublic } = props.data
  const { type } = props
  return (
    <Card sx={{ p: '10px 5px', mb: 2, position: 'relative' }} variant="outlined">
      <Box sx={{ position: 'absolute', right: 5, top: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ fontSize: 16 }}>{stars}</Box>
          <IconButton size="small" sx={{ color: '#9e04ff' }}>
            <StarBorderIcon />
          </IconButton>
          {type === 'courses' && (isPublic ? <PublicIcon sx={{ color: '#9e04ff' }} /> : <LockIcon sx={{ color: '#9e04ff' }} />)}
        </Box>
      </Box>
      <Link
        to={`/my-lps/${type}/${id}`}
        style={{ textDecoration: 'none', fontWeight: 500, color: '#1976d2', fontSize: 14 }}>
        {name}
      </Link>
    </Card>
  )
}
export default LP
