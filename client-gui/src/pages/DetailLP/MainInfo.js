import * as React from 'react'
import { Box, Divider, IconButton, Avatar, Typography, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import StarIcon from '@mui/icons-material/StarRounded'
import StarBorderIcon from '@mui/icons-material/StarBorderRounded'

import LinearProgressWithLabel from '../../components/customs/LinearProgress'
import vars from '../../config/vars'
import { HTTP_STATUS } from '../../constants'
import { lpApi } from '../../apis'

const DesTextField = (props) => {
  const {
    data: { name, value }
  } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        mt: 1.5
      }}>
      <Box sx={{ width: 100, fontSize: 14 }}>{name}</Box>
      <Box sx={{ fontWeight: 500, ml: 1, flexGrow: 1, fontSize: 14 }}>{value}</Box>
    </Box>
  )
}

const MainInfo = (props) => {
  const { data } = props
  const [star, setStar] = React.useState({ stars: data.stars, starred: data.starred })
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  const starLP = async () => {
    try {
      const { status, data } = await lpApi.starLP(props.data.id)
      if (status === HTTP_STATUS.OK) {
        setStar({ starred: true, stars: star.stars + 1 })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const unStarLP = async () => {
    try {
      const { status, data } = await lpApi.unStarLP(props.data.id)
      if (status === HTTP_STATUS.OK) {
        setStar({ starred: false, stars: star.stars - 1 })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Divider textAlign="left">{t('learningPath.information')}</Divider>
      {data && (
        <Box>
          <DesTextField
            data={{
              name: t('learningPath.owner'),
              value: (
                <Button
                  size="small"
                  onClick={() => navigate(`/profile/${data.ownerId._id}`)}
                  startIcon={
                    <Avatar
                      src={`${vars.server}/resources/avatars/${data.ownerId._id}/64x64${data.ownerId.avatar}`}
                    />
                  }
                  sx={{
                    textTransform: 'none',
                    width: '100%',
                    fontSize: 14,
                    '&.MuiButton-root': { justifyContent: 'flex-start' }
                  }}>
                  {data.ownerId.name}
                </Button>
              )
            }}
          />
          <DesTextField
            data={{
              name: t('learningPath.stars'),
              value: (
                <Box>
                  {star.stars}
                  {star.starred && (
                    <IconButton onClick={unStarLP} size="small" sx={{ color: '#9e04ff' }}>
                      <StarIcon />
                    </IconButton>
                  )}
                  {!star.starred && (
                    <IconButton onClick={starLP} size="small" sx={{ color: '#9e04ff' }}>
                      <StarBorderIcon />
                    </IconButton>
                  )}
                </Box>
              )
            }}
          />
          <DesTextField data={{ name: 'ID', value: data.id }} />
          <DesTextField
            data={{ name: t('learningPath.category'), value: t(`categories.${data.category}`) }}
          />
          {data.forkFrom && (
            <DesTextField
              data={{
                name: 'Clone from',
                value: (
                  <Link to={`/my-lps/${data.forkFrom}`} target="_blank">
                    {data.cloneFromName}
                  </Link>
                )
              }}
            />
          )}
          <DesTextField
            data={{
              name: t('learningPath.completed'),
              value: (
                <LinearProgressWithLabel
                  value={
                    isNaN((data.completedActions / data.totalActions) * 100)
                      ? 0
                      : (data.completedActions / data.totalActions) * 100
                  }
                />
              )
            }}
          />
        </Box>
      )}
    </Box>
  )
}
export default MainInfo
