import * as React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import MyOrganizations from './MyOrganizations'
import { ogzApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useSnackbar, useDocumentTitle, useBreadcrumb } from '../../contexts'

const Organization = (props) => {
  const [openCreateNew, setOpenCreateNew] = React.useState(false)
  const [ogzName, setOgzName] = React.useState('')
  const [ogzType, setOgzType] = React.useState('school')
  const [description, setDescription] = React.useState('')
  const [myOgzs, setMyOgzs] = React.useState(null)
  const { t } = useTranslation('common')

  const { openSnackbar } = useSnackbar()
  const { setTitle } = useDocumentTitle()
  const { handleAddBreadcrumb } = useBreadcrumb()

  const handleChangeOgzType = (e) => {
    setOgzType(e.target.value)
  }
  const handleChangeOgzName = (e) => {
    setOgzName(e.target.value)
  }
  const handleClickCreateNew = () => {
    setOpenCreateNew(true)
  }
  const handleCloseCreateNew = () => {
    setOpenCreateNew(false)
  }

  const getMyOgzs = async () => {
    try {
      const { status, data } = await ogzApi.getMyOgzs()
      if (status === HTTP_STATUS.OK) {
        setMyOgzs(data)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Can not load your organizations')
    }
  }

  const submitCreateOgz = async () => {
    if (ogzName === '') {
      openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
      return
    }
    try {
      const { status, data } = await ogzApi.createOgz({
        name: ogzName,
        ogzType,
        description
      })
      if (status === HTTP_STATUS.OK) {
        setMyOgzs([...myOgzs, data])
      } else {
        openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error when create organization')
    }
  }

  React.useEffect(() => {
    handleAddBreadcrumb('/organizations', 'Organization')
    setTitle('Organization')
    getMyOgzs()
  }, [])

  return (
    <Box sx={{ background: 'white', p: 2, mt: 2, borderRadius: 3, minHeight: 'calc(100vh - 140px)' }} >
      <Box>
        <Button onClick={handleClickCreateNew}>{t('organization.create')}</Button>
        {myOgzs && (
          <MyOrganizations organizations={myOgzs} />
        )}
      </Box>
      <Dialog open={openCreateNew} onClose={handleCloseCreateNew}>
        <DialogTitle>{t('organization.create')}</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            fullWidth
            required
            label={t('organization.namePlaceholder')}
            value={ogzName}
            onChange={handleChangeOgzName}
            sx={{ mb: 2, mt: 2 }}
          />
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">{t('organization.type.name')}</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              fullWidth
              value={ogzType}
              label={t('organization.type.name')}
              onChange={handleChangeOgzType}>
              <MenuItem value="school">{t('organization.type.school')}</MenuItem>
              <MenuItem sx={{ mt: 2 }} value="academy">
              {t('organization.type.academy')}
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            fullWidth
            label={t('organization.description')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateNew}>{t('organization.cancel')}</Button>
          <Button onClick={submitCreateOgz} autoFocus>
          {t('organization.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
export default Organization
