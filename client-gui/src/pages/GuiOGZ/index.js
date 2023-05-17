import * as React from 'react'
import {
  Box,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton
} from '@mui/material'
import { styled } from '@mui/material/styles'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation } from 'react-router-dom'

import vars from '../../config/vars'
import { useSnackbar, useBreadcrumb } from '../../contexts'
import { ogzApi, uploadApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'

const Input = styled('input')({
  display: 'none'
})

const GuideOGZ = (props) => {
  const [detail, setDetail] = React.useState({})
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [backgroundImg, setBackgroundImg] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [foundDate, setFoundDate] = React.useState(new Date())
  const [selectBackground, setSelectBackground] = React.useState(null)
  const { ogzId } = useParams()
  const { openSnackbar } = useSnackbar()
  const { handleAddBreadcrumb } = useBreadcrumb()
  const { pathname } = useLocation()
  const { t } = useTranslation('common')
  const getOgzInfo = async () => {
    try {
      const { status, data } = await ogzApi.getOgzDetail(ogzId)
      if (status === HTTP_STATUS.OK) {
        const { members, ogzDetail } = data
        setDetail({ members, ...ogzDetail })
        handleAddBreadcrumb(pathname, `Information - ${ogzDetail.name}`)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error when load data')
    }
  }
  const submitChange = async () => {
    if (name === '') {
      openSnackbar(SNACKBAR.WARNING, 'Name must not be empty')
      return
    }
    try {
      const { status, data } = await ogzApi.updateOgz(ogzId, {
        name,
        address,
        category,
        email,
        phone,
        foundDate
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Update successfully')
        setDetail({ ...detail, ...data })
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const handleSelectBackground = (e) => {
    const file = Object.entries(e.target.files).map(([id, file]) => file)[0]
    setSelectBackground(file)
  }

  const submitUpload = async () => {
    if (!selectBackground) return
    const form = new FormData()
    form.append('ogzBg', selectBackground)
    try {
      const { status, data } = await uploadApi.changeBackgroundOgz(ogzId, form)
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Change background successfully')
        setBackgroundImg(data)
        setSelectBackground(null)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  React.useEffect(() => {
    getOgzInfo()
  }, [])
  React.useEffect(() => {
    handleAddBreadcrumb(pathname, `Information - ${detail.name}`)
    setName(detail.name)
    setAddress(detail.address || '')
    setCategory(detail.category || '')
    setEmail(detail.email || '')
    setPhone(detail.phone || '')
    setFoundDate(detail.foundDate ? new Date(detail.foundDate) : new Date())
    setBackgroundImg(detail.backgroundImg || null)
  }, [detail])
  return (
    <Box
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 3
      }}>
      <Box
        sx={{
          position: 'relative',
          background: 'white',
          p: 2,
          mt: 2,
          height: 300,
          borderRadius: 3,
          backgroundImage: backgroundImg
            ? `url(${vars.server}/resources/organizations/${ogzId}/${backgroundImg})`
            : 'none',
          backgroundSize: '100%',
          backgroundPosition: 'center',
          zIndex: 4
        }}>
        <label style={{ position: 'absolute', bottom: 2, right: 2 }} htmlFor="icon-button-file">
          <Input
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={handleSelectBackground}
          />
          <IconButton
            aria-label="upload picture"
            component="span"
            sx={{ color: 'white', background: 'rgba(112, 112, 112, 0.64)' }}>
            <CameraAltRoundedIcon />
          </IconButton>
        </label>
        {selectBackground && (
          <IconButton
            onClick={submitUpload}
            sx={{
              color: 'white',
              position: 'absolute',
              bottom: '50px',
              right: 2,
              background: 'rgba(112, 112, 112, 0.64)'
            }}>
            <FileUploadRoundedIcon />
          </IconButton>
        )}
      </Box>
      <Box
        sx={{
          minHeight: 300,
          background: 'white',
          position: 'relative',
          p: 3,
          mt: -3,
          mx: 6,
          borderRadius: 3,
          zIndex: 5
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(52, 71, 103)' }}>
            {detail.name || ''}
          </Box>
          {detail.youAreAdmin && <Button onClick={() => setOpen(true)}>{t('organization.updateInfo')}</Button>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'lightslategray',
              fontWeight: 'bold'
            }}>
            <PersonRoundedIcon sx={{ mr: 1, color: '#890589' }} />
            {detail.members ? detail.members.length + 1 : 1}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 5,
              color: 'lightslategray',
              fontWeight: 'bold'
            }}>
            <TrackChangesIcon sx={{ mr: 1, color: '#890589' }} />
            {detail.learningPaths ? detail.learningPaths.length : 0}
          </Box>
        </Box>
        <Divider sx={{ mx: 3 }} />
        <Box sx={{ mt: 2, p: 3 }}>
          <Grid container spacing={2}>
            <Grid sx={{ fontWeight: 'bold', mb: 1 }} item xs={4}>
            {t('organization.address')}
            </Grid>
            <Grid sx={{ color: 'lightslategray', mb: 1 }} item xs={8}>
              {detail.address || ''}
            </Grid>
            <Grid sx={{ fontWeight: 'bold', mb: 1 }} item xs={4}>
            {t('organization.category')}
            </Grid>
            <Grid sx={{ color: 'lightslategray', mb: 1 }} item xs={8}>
              {detail.category || ''}
            </Grid>
            <Grid sx={{ fontWeight: 'bold', mb: 1 }} item xs={4}>
            {t('organization.email')}
            </Grid>
            <Grid sx={{ color: 'lightslategray', mb: 1 }} item xs={8}>
              {detail.email || ''}
            </Grid>
            <Grid sx={{ fontWeight: 'bold', mb: 1 }} item xs={4}>
            {t('organization.phone')}
            </Grid>
            <Grid sx={{ color: 'lightslategray', mb: 1 }} item xs={8}>
              {detail.phone || ''}
            </Grid>
            <Grid sx={{ fontWeight: 'bold', mb: 1 }} item xs={4}>
            {t('organization.foundDate')}
            </Grid>
            <Grid sx={{ color: 'lightslategray', mb: 1 }} item xs={8}>
              {detail.foundDate ? new Date(detail.foundDate).toDateString() : ''}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('organization.updateInfo')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('organization.name')}
            size="small"
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t('organization.category')}
            size="small"
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t('organization.address')}
            size="small"
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('organization.phone')}
            size="small"
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('organization.email')}
            size="small"
            sx={{ mb: 1.5 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('organization.foundDate')}
              inputFormat="MM/dd/yyyy"
              value={foundDate}
              onChange={(v) => setFoundDate(v)}
              renderInput={(params) => <TextField size="small" fullWidth {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('organization.cancel')}</Button>
          <Button onClick={submitChange}>{t('organization.update')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
export default GuideOGZ
