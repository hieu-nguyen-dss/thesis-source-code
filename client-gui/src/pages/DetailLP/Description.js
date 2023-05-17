import * as React from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputBase
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { lpApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useSnackbar } from '../../contexts'
import descriptionIcon from '../../assets/flaticon/document.png'

const Input = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 5,
    fontSize: 14,
    padding: '14px 2px',
    fontWeight: 'bold',
    border: '2px solid #fff',
    '&:focus': {
      borderColor: '#2979ff',
      background: 'white'
    },
    '&:hover': {
      borderColor: '#2979ff',
      background: 'white'
    }
  }
}))

const Description = (props) => {
  const [value, setValue] = React.useState(props.data)
  const [open, setOpen] = React.useState(false)
  const [changed, setChanged] = React.useState(true)
  const { openSnackbar } = useSnackbar()
  const { id } = useParams()
  const { t } = useTranslation('common')

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setValue(props.data)
    setOpen(false)
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (e.target.value !== '' && e.target.value !== props.data) {
      setChanged(false)
    } else {
      setChanged(true)
    }
  }

  const submitChange = async () => {
    try {
      const { status, data } = await lpApi.editLP(id, { description: value })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Save done!')
      } else {
        openSnackbar(SNACKBAR.ERROR, 'Try again')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }
  return (
    <Button
      disabled={open}
      onClick={handleOpen}
      sx={{
        color: '#6c68f3',
        background: 'white',
        fontWeight: 500,
        border: '1px solid #F7F8F9',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
        m: 2,
        mt: 0,
        flexGrow: 1,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <img src={descriptionIcon} width="130" height="130" />
      </Box>
      <Box sx={{ fontSize: 14, textAlign: 'center' }}>{t('learningPath.description')}</Box>
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { minWidth: 600, minHeight: 300 } }} >
        <DialogTitle>{t('learningPath.description')}</DialogTitle>
        <DialogContent>
          <Input value={value} onChange={handleChange} fullWidth multiline />
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            disabled={changed}
            onClick={submitChange}
            sx={{
              mr: 1,
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none'
            }}>
            {t('button.saveChange')}
          </Button>
          <Button
            size="small"
            sx={{
              mr: 1,
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none'
            }}
            onClick={handleClose}>
            {t('button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Button>
  )
}
export default Description
