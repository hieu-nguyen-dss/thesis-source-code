import * as React from 'react'
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField
} from '@mui/material'

import { userApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useSnackbar } from '../../contexts'

const AdminAcc = (props) => {
  const [admins, setAdmins] = React.useState([])
  const [openCreate, setOpenCreate] = React.useState(false)
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { openSnackbar } = useSnackbar()
  const getAdminList = async () => {
    try {
      const { status, data } = await userApi.adminList()
      if (status === HTTP_STATUS.OK) {
        setAdmins(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const submitCreate = async () => {
    if (firstName === '' || lastName === '' || email === '' || password === '') {
      openSnackbar(SNACKBAR.WARNING, 'Please fill in all required fields')
      return
    }
    try {
      const { status, data } = await userApi.signup({
        name: `${firstName} ${lastName}`,
        email,
        password
      })
      if (status === HTTP_STATUS.BAD_REQUEST) {
        openSnackbar(SNACKBAR.WARNING, 'Email existed')
        return
      }
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Create successfully')
        console.log(data)
        setAdmins([...admins, data.user])
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error when create account')
    }
  }
  const submitDelete = async (index) => {
    try {
      const { status, data } = await userApi.deleteAcc({
        id: admins[index]._id,
        email: admins[index].email
      })
      if (status === HTTP_STATUS.OK) {
        setAdmins([...admins.slice(0, index), ...admins.slice(index + 1)])
      }
      if (status === 406) {
        openSnackbar(SNACKBAR.WARNING, 'Can not delete this account')
      }
    } catch (error) {}
  }
  React.useEffect(() => {
    getAdminList()
  }, [])
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 2,
          color: (theme) => theme.palette.primary.main,
          textTransform: 'uppercase',
          fontWeight: 500,
          fontSize: 13
        }}>
        Admins list
      </Box>
      <Grid container columns={{ md: 16 }} alignItems="center">
        <Grid item xs={6}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
            NAME
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
            EMAIL
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
            ACTIONS
          </Typography>
        </Grid>
        <Grid item xs={16}>
          <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
        </Grid>
        {admins.map((admin, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
                {admin.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'lightslategray' }}>
                {admin.email}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button
                color="error"
                size="small"
                onClick={() => submitDelete(index)}
                sx={{ textTransform: 'none' }}>
                Delete
              </Button>
            </Grid>
            <Grid item xs={16}>
              <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Button onClick={() => setOpenCreate(true)} size="small">
        Create account
      </Button>
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create admin account</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                size="small"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                placeholder="Firstname"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                placeholder="Lastname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                placeholder="Email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                placeholder="Password"
                type="password"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setOpenCreate(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={submitCreate} size="small" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
export default AdminAcc
