import * as React from 'react'
import {
  Grid,
  Avatar,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide
} from '@mui/material'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import vars from '../../config/vars'
import { useAuth, useSnackbar } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { ogzApi } from '../../apis'

const ADMIN = 'ADMIN'
const MEMBER = 'MEMBER'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Member = ({ data, youAreAdmin, setYouAreAdmin, removeMember: updateMemberList }) => {
  const [isAdmin, setIsAdmin] = React.useState(data.role === ADMIN)
  const [openAdminDialog, setOpenAdminDialog] = React.useState(false)
  const [openMemberDialog, setOpenMemberDialog] = React.useState(false)
  const [openRemoveDialog, setRemoveDialog] = React.useState(false)
  const { t } = useTranslation('common')
  const auth = useAuth()
  const { ogzId } = useParams()
  const { openSnackbar } = useSnackbar()
  const you = data.user._id === auth.user.userId

  const handleOpenAdminDialog = () => {
    if (!isAdmin) {
      setOpenAdminDialog(true)
    }
  }
  const handleOpenMemberDialog = () => {
    if (isAdmin) {
      setOpenMemberDialog(true)
    }
  }
  const submitChangeRole = async (role) => {
    if (!youAreAdmin) {
      openSnackbar(SNACKBAR.ERROR, 'You are not admin')
    }
    try {
      const { status } = await ogzApi.editRole(ogzId, data.user._id, role)
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Change role success')
        if (role === ADMIN) {
          setIsAdmin(true)
        }
        if (role === MEMBER) {
          setIsAdmin(false)
        }
        setOpenAdminDialog(false)
        setOpenMemberDialog(false)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'No perrmission')
    }
  }

  const addAsAdmin = async () => {
    await submitChangeRole(ADMIN)
  }

  const removeAsAdmin = async () => {
    await submitChangeRole(MEMBER)
    if (you) {
      setYouAreAdmin(false)
    }
  }

  const removeMember = async () => {
    if (!youAreAdmin) return
    try {
      const { status } = await ogzApi.removeMember(ogzId, data.user._id)
      if (status === HTTP_STATUS.OK) {
        updateMemberList()
      }
    } catch (error) {}
  }

  const leaveOgz = async () => {}

  return (
    <React.Fragment>
      <Grid item xs={3}>
        <Link
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
          to={`/profile/${data.user._id}`}>
          <Avatar
            sx={{ width: 40, height: 40, mr: 1 }}
            alt={data.user.name}
            src={`${vars.server}/resources/avatars/${data.user._id}/64x64${data.user.avatar}`}
          />
          <Box>
            <Typography
              sx={{
                fontSize: 14,
                color: (theme) => theme.palette.primary.main,
                fontWeight: 'bold'
              }}>
              {data.user.name}
            </Typography>
          </Box>
          {you && (
            <Chip sx={{ ml: 2 }} color="warning" variant="outlined" size="small" label="You" />
          )}
        </Link>
      </Grid>
      <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} item xs={3}>
        <Typography sx={{ fontSize: 14, color: 'lightslategray' }}>{data.user.email}</Typography>
      </Grid>
      <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} item xs={3}>
        <Typography sx={{ color: 'lightslategray', fontSize: 14 }}>
          {isAdmin ? ADMIN : MEMBER}
        </Typography>
      </Grid>
      <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} item xs={3}>
        <Box sx>
          {youAreAdmin && (
            <>
              <Tooltip title={t('organization.members.removeAsAdmin')}>
                <IconButton
                  onClick={handleOpenMemberDialog}
                  color={!isAdmin ? 'success' : 'default'}
                  sx={{ mr: 2 }}
                  size="small">
                  <PersonRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('organization.members.addAsAdmin')}>
                <IconButton
                  onClick={handleOpenAdminDialog}
                  color={isAdmin ? 'info' : 'default'}
                  size="small"
                  sx={{ mr: 2 }}>
                  <AdminPanelSettingsRoundedIcon />
                </IconButton>
              </Tooltip>
              {!you && (
                <Tooltip title={t('organization.members.remove')}>
                  <IconButton onClick={() => setRemoveDialog(true)} color="error" size="small" sx={{ mr: 2 }}>
                    <CancelRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          {you && (
            <Tooltip title={t('organization.members.leave')}>
              <IconButton onClick={leaveOgz} color="error" size="small">
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ height: 0.5, color: 'lightgray' }} />
      </Grid>
      <Dialog
        TransitionComponent={Transition}
        open={openAdminDialog}
        onClose={() => setOpenAdminDialog(false)}>
        <DialogTitle>{t('organization.members.addAsAdmin')}</DialogTitle>
        <DialogContent>
          <Box>
          {t('organization.members.addAsAdminNote')}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              mt: 2,
              ml: 3.9,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('organization.members.cancel')}
          </Button>
          <Button
            onClick={addAsAdmin}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              mt: 2,
              ml: 3.9,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('organization.members.ok')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        TransitionComponent={Transition}
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}>
        <DialogTitle>{t('organization.members.removeAsAdmin')}</DialogTitle>
        <DialogContent>
          <Box>{t('organization.members.removeAsAdminNote')}</Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              mt: 2,
              ml: 3.9,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('organization.members.cancel')}
          </Button>
          <Button
            onClick={removeAsAdmin}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              mt: 2,
              ml: 3.9,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('organization.members.ok')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        TransitionComponent={Transition}
        open={openRemoveDialog}
        onClose={() => setRemoveDialog(false)}>
        <DialogTitle>{t('organization.members.remove')}</DialogTitle>
        <DialogContent>
          <Box>{t('organization.members.removeNote')}</Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRemoveDialog(false)}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              mt: 2,
              ml: 3.9,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('organization.members.cancel')}
          </Button>
          <Button
            onClick={removeMember}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              mt: 2,
              ml: 3.9,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('organization.members.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
export default Member
