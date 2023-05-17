import * as React from 'react'
import { Card, Typography, CardContent, Box, Avatar, Chip, IconButton } from '@mui/material'
import StarIcon from '@mui/icons-material/StarRounded'
import TimelineIcon from '@mui/icons-material/Timeline'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import vars from '../../config/vars'
import { CATEGORY } from '../../constants'

const LP = ({ data, filter }) => {
  const { t } = useTranslation('common')
  return (
    <Card variant="outlined" sx={{ mb: 1, position: 'relative', p: 1, pb: 0, borderRadius: 2 }}>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'flex'
        }}>
        <Box
          sx={{
            background: '#e3e8ef',
            color: data.steps ? '#3fb929' : '#ff9900',
            width: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 500,
            borderRight: '2px solid gray',
            borderBottomLeftRadius: 12
          }}>
          {data.steps && (
            <>
              <TimelineIcon sx={{ mr: 0.5 }} />
              {t('discovery.roadmap')}
            </>
          )}
          {data.parts && (
            <>
              <TrackChangesIcon sx={{ mr: 0.5 }} />
              {t('discovery.course')}
            </>
          )}
        </Box>
        <Box
          sx={{
            width: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 0.5,
            color: '#9e04ff',
            background: '#e3e8ef',
            fontWeight: 500
          }}>
          <Typography>{data.stars || 0}</Typography>
          <StarIcon />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link
          to={data.parts ? `/my-lps/courses/${data.id}` : `/my-lps/roadmaps/${data.id}`}
          style={{ textTransform: 'none', textDecoration: 'none' }}>
          <Typography sx={{ color: 'black', fontWeight: 500 }}>{data.name}</Typography>
        </Link>
        <Chip
          size="small"
          color="info"
          sx={{ ml: 2 }}
          label={t(`categories.${data.category}`)}
          onClick={() => filter('category', CATEGORY[data.category].code)}
        />
      </Box>
      <CardContent sx={{ p: 1 }}>
        <Link
          to={`/profile/${data.owner._id}`}
          style={{
            textTransform: 'none',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
          <Avatar
            sx={{ width: 30, height: 30, mr: 1, border: '2px solid #6c68f3', p: '1px' }}
            alt={data.owner.name}
            src={`${vars.server}/resources/avatars/${data.owner._id}/64x64${data.owner.avatar}`}
          />
          <Typography
            sx={{ fontSize: 14, fontWeight: 'bold', color: (theme) => theme.palette.primary.main }}>
            {data.owner.name}
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Typography sx={{ fontSize: 14 }}>
            {data.parts ? `${data.parts.length} ${t('discovery.parts')}` : `${data.steps.length} ${t('discovery.steps')}`}
          </Typography>
          <Typography sx={{ fontSize: 14, borderLeft: '2px solid lightgrey', pl: 7 }}>
          {t('discovery.createdAt')}
            <label style={{ color: '#363062', fontWeight: 600 }}>
              {new Date(data.createdAt).toLocaleDateString('vi-VN')}
            </label>
          </Typography>
          <Typography sx={{ fontSize: 14, borderLeft: '2px solid lightgrey', pl: 7 }}>
          {t('discovery.lastUpdated')}
            <label style={{ color: '#363062', fontWeight: 600 }}>
              {new Date(data.updatedAt).toLocaleDateString('vi-VN')}
            </label>
          </Typography>
          <Typography sx={{ fontSize: 14, borderLeft: '2px solid lightgrey', pl: 7 }}>
            {data.comments ? data.comments.length : 0} {t('discovery.comments')}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 14, mt: 2 }}>{data.description}</Typography>
      </CardContent>
    </Card>
  )
}
export default LP
