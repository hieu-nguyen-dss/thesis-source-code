import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, TextField, FormControlLabel, Checkbox, Grid, Box, Typography } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import background from '../../assets/images/4783543.png'
import { userApi } from '../../apis'
import { useAuth, useDocumentTitle, useSnackbar } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'

export default function SignIn() {
  const navigate = useNavigate()
  const auth = useAuth()
  const documentTitle = useDocumentTitle()
  const { openSnackbar } = useSnackbar()
  const { t, i18n } = useTranslation('common')

  const from = '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const info = {
      email: form.get('email'),
      password: form.get('password')
    }
    if (info.email === '' || info.password === '') {
      openSnackbar(SNACKBAR.WARNING, 'Fill in all required field')
      return
    }
    const {
      status,
      data: { user, accessToken }
    } = await userApi.login(info)
    if (status === HTTP_STATUS.OK) {
      auth.signin(
        { name: user.name, email: user.email, userId: user._id, avatar: user.avatar },
        accessToken,
        () => {
          navigate(from, { replace: true })
        }
      )
    } else if (status === HTTP_STATUS.UNAUTHORIZED) {
      openSnackbar(SNACKBAR.ERROR, 'Not permission')
    } else if (status === HTTP_STATUS.BAD_REQUEST || status === HTTP_STATUS.NOT_FOUND) {
      openSnackbar(SNACKBAR.ERROR, 'Email or password is incorrect')
    }
  }

  React.useEffect(() => {
    documentTitle.setTitle('Login')
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: `url(${background})`,
        backgroundColor: 'white',
        backgroundSize: '60%',
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat'
      }}>
      <Box sx={{ width: '40%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            m: 'auto'
          }}>
          <Box sx={{ fontWeight: 500, fontSize: 32, mb: 5, color: '#545185' }}>Learning Path</Box>
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: 'lightslategray' }}>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              size="small"
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.login.email')}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              size="small"
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.login.password')}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                textTransform: 'none',
                background: '#545185',
                color: 'white',
                '&:hover': { background: '#545185' }
              }}>
              Login
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link style={{ fontSize: 14 }} to="/signup">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
