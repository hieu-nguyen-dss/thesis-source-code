import * as React from 'react'
import {
  Box,
  Avatar,
  Divider,
  Container,
  Typography,
  Grid,
  IconButton,
  Button
} from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { userApi, uploadApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useSnackbar, useAuth } from '../../contexts'
import { setData } from '../../utils/localStorage'
import vars from '../../config/vars'
import LP from './LP'
// https://miro.medium.com/max/1400/1*Sdfm4E98ugZGQ-u5Xoa83g.png

const Input = styled('input')({
  display: 'none'
})

const Profile = (props) => {
  const { userId } = useParams()
  const [user, setUser] = React.useState(null)
  const [lps, setLps] = React.useState([])
  const [rms, setRms] = React.useState([])
  const [following, setFollowing] = React.useState([])
  const [you, setYou] = React.useState(false)
  const [selectedNewAvt, setSelectedNewAvt] = React.useState(false)
  const [newAvt, setNewAvt] = React.useState(null)
  const { openSnackbar } = useSnackbar()
  const { t } = useTranslation('common')
  const { user: contextUser, setUser: setContextUser } = useAuth()
  const getUser = async () => {
    try {
      const { status, data } = await userApi.getUserDetail(userId)
      if (status === HTTP_STATUS.OK) {
        console.log(data)
        setUser(data.user)
        setLps(data.lps)
        setRms(data.rms)
        setYou(data.you)
        setFollowing(data.ufr.map(rm => rm.followingRoadmaps))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelect = (e) => {
    const file = Object.entries(e.target.files).map(([id, file]) => file)[0]
    setNewAvt(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedNewAvt(true)
      document.getElementById('new-im').setAttribute('src', e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const submitChangeAvatar = async () => {
    const form = new FormData()
    form.append('avatar', newAvt)
    try {
      const { status, data } = await uploadApi.changeAvatar(userId, form)
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Change avatar successfully')
        setContextUser({ ...contextUser, avatar: data })
        setUser({ ...user, avatar: data })
        setData('user', { ...contextUser, avatar: data })
        setSelectedNewAvt(false)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  React.useEffect(() => {
    getUser()
  }, [])
  if (!user) return <Box></Box>
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
        p: 2,
        background: 'white',
        borderRadius: 3
      }}>
      <Box className="left" sx={{ width: 300 }}>
        {selectedNewAvt
          ? (
            <img id="new-im" src="#" width={300} height={300} style={{ borderRadius: 5 }} />
            )
          : (
              <Avatar
                alt="avatar"
                variant="rounded"
                src={`${vars.server}/resources/avatars/${userId}/${user.avatar || contextUser.avatar}`}
                sx={{ width: 300, height: 300 }}
              />
            )}
        {you && (
          <label htmlFor="icon-button-file">
          <Input accept="image/*" id="icon-button-file" type="file" onChange={handleSelect} />
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
          {selectedNewAvt && (
            <Button
              onClick={submitChangeAvatar}
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
              Save change
            </Button>
          )}
        </label>
        )}
      </Box>
      <Box className="right" sx={{ flexGrow: 1, pl: 10 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>{user.name}</Typography>
        <Typography
          sx={{ fontSize: 13, color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
          {/* {user.userType} */}
          {t(`profile.${user.userType.toLowerCase()}`)}
        </Typography>
        <Box sx={{ mt: 5 }}>
          <Divider textAlign="left" sx={{ fontSize: 14, color: 'lightslategray', mb: 2, fontWeight: 500 }}>
            {t('profile.contact')}
          </Divider>
          <Grid container spacing={2}>
            <Grid item xs={4} sx={{ fontSize: 14 }}>
              Email
            </Grid>
            <Grid
              item
              xs={8}
              sx={{
                fontSize: 14,
                fontWeight: 'bold',
                color: (theme) => theme.palette.primary.main
              }}>
              {user.email}
            </Grid>
          </Grid>
          <Divider textAlign="left" sx={{ fontSize: 14, color: 'lightslategray', mb: 2, fontWeight: 500, mt: 5 }}>
            {t('profile.courses')}
          </Divider>
          {lps && lps.map((lp, index) => <LP type='courses' data={lp} key={index} />)}
          <Divider textAlign="left" sx={{ fontSize: 14, color: 'lightslategray', mb: 2, fontWeight: 500, mt: 5 }}>
            {t('profile.roadmaps')}
          </Divider>
          {rms && rms.map((rm, index) => <LP data={rm} type='roadmaps' key={index} />)}
          <Divider textAlign="left" sx={{ fontSize: 14, color: 'lightslategray', mb: 2, fontWeight: 500, mt: 5 }}>
            {t('profile.following')}
          </Divider>
          {following && following.map((rm, index) => <LP data={rm} type='roadmaps' key={index} />)}
        </Box>
      </Box>
    </Container>
  )
}

export default Profile
