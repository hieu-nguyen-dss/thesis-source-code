import * as React from 'react'
import { Box, Button, IconButton, Typography, Avatar } from '@mui/material'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import StarIcon from '@mui/icons-material/StarRounded'
import StarBorderIcon from '@mui/icons-material/StarBorderRounded'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { roadmapApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'
import vars from '../../config/vars'

const Follow = (props) => {
  const { followers, following, yours: editable, ownerId, youStarred, stars } = props.data
  const { roadmapId } = useParams()
  const [isFollowing, setIsFollowing] = React.useState(following)
  const [amountFollower, setAmountFollower] = React.useState(followers)
  const [starred, setStarred] = React.useState(youStarred)
  const [countStars, setCountStars] = React.useState(stars)
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const follow = async () => {
    if (editable) return
    try {
      const { status, data } = await roadmapApi.followRoadmap(roadmapId, ownerId._id)
      if (status === HTTP_STATUS.OK) {
        if (data) {
          setIsFollowing(true)
          setAmountFollower(data.followers)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const unfollow = async () => {
    if (editable) return
    try {
      const { status, data } = await roadmapApi.unfollowRoadmap(roadmapId)
      if (status === HTTP_STATUS.OK) {
        if (data) {
          setIsFollowing(false)
          setAmountFollower(data.followers)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const star = async () => {
    try {
      const { status, data } = await roadmapApi.starRoadmap(roadmapId)
      if (status === HTTP_STATUS.OK) {
        if (data) {
          setCountStars(data)
          setStarred(!starred)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const unstar = async () => {
    try {
      const { status, data } = await roadmapApi.unStarRoadmap(roadmapId)
      if (status === HTTP_STATUS.OK) {
        if (data) {
          setCountStars(data)
          setStarred(!starred)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box>
      <Button
        size="small"
        onClick={() => navigate(`/profile/${ownerId._id}`)}
        startIcon={
          <Avatar
            src={`${vars.server}/resources/avatars/${ownerId._id}/64x64${ownerId.avatar}`}
            alt={ownerId.name}
          />
        }
        sx={{
          textTransform: 'none',
          fontSize: 14,
          mb: 2,
          borderRadius: 2,
          width: 'calc(100% - 25px)',
          '&:hover': {
            background: 'rgb(151 151 151 / 22%)'
          },
          background: theme => theme.palette.background.default,
          '&.MuiButton-root': { justifyContent: 'flex-start' }
        }}>
        {ownerId.name}
      </Button>
      {!editable && (
        <React.Fragment>
          {isFollowing && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={unfollow}
                startIcon={<RecordVoiceOverIcon />}
                size="small"
                sx={{
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'white'
                  }
                }}>
                {t('roadmap.unfollow')}
              </Button>
              <Typography sx={{ fontWeight: 500, fontSize: 14, ml: 2 }}>
                {followers
                  ? followers <= 1
                    ? `${followers} ${t('roadmap.follower')}`
                    : `${followers} ${t('roadmap.followers')}`
                  : `0 ${t('roadmap.follower')}`}
              </Typography>
            </Box>
          )}
          {!isFollowing && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={follow}
                startIcon={<RecordVoiceOverIcon />}
                size="small"
                sx={{
                  color: 'white',
                  background: '#6c68f3',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#8f8bf9',
                    border: '2px solid #8f8bf9'
                  }
                }}>
                {t('roadmap.follow')}
              </Button>
              <Typography sx={{ fontWeight: 500, fontSize: 14, ml: 2 }}>
                {amountFollower
                  ? amountFollower <= 1
                    ? `${amountFollower} ${t('roadmap.follower')}`
                    : `${amountFollower} ${t('roadmap.followers')}`
                  : `0 ${t('roadmap.follower')}`}
              </Typography>
            </Box>
          )}
          <Box sx={{ color: 'lightslategray', fontSize: 13, mt: 1 }}>
            You will receive notification everytime this roadmap is updated
          </Box>
        </React.Fragment>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
        {editable && (
          <Box
            sx={{
              p: 1,
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              background: 'white',
              borderRadius: 2
            }}>
            <RecordVoiceOverIcon sx={{ color: '#6c68f3' }} />
            <Typography sx={{ color: '#6c68f3', fontWeight: 500, fontSize: 14, ml: 1 }}>
              {amountFollower
                ? amountFollower <= 1
                  ? `${amountFollower} ${t('roadmap.follower')}`
                  : `${amountFollower} ${t('roadmap.followers')}`
                : `0 ${t('roadmap.follower')}`}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            background: 'white',
            justifyContent: 'center',
            p: 0.4
          }}>
          {countStars}
          {starred && (
            <IconButton onClick={unstar} size="small" sx={{ color: '#6c68f3' }}>
              <StarIcon />
            </IconButton>
          )}
          {!starred && (
            <IconButton onClick={star} size="small" sx={{ color: '#6c68f3' }}>
              <StarBorderIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default Follow
