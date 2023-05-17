import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { userApi } from '../../apis'
import { useAuth, useDocumentTitle } from '../../contexts'
import { HTTP_STATUS } from '../../constants'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '} */}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const theme = createTheme()

export default function SignIn() {
  const navigate = useNavigate()
  const auth = useAuth()
  const documentTitle = useDocumentTitle()
  const { t, i18n } = useTranslation('common')

  const from = '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const info = {
      email: form.get('email'),
      password: form.get('password')
    }
    const { status, data: { user, accessToken } } = await userApi.login(info)
    if (status === HTTP_STATUS.OK) {
      auth.signin(
        { name: user.name, email: user.email, userId: user._id, avatar: user.avatar },
        accessToken,
        () => {
          navigate(from, { replace: true })
        }
      )
    }
  }

  React.useEffect(() => {
    documentTitle.setTitle('Login')
  }, [])

  return (
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('login.password')}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <Link to='/signup'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  )
}
