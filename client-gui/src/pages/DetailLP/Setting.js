import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormGroup,
  Box,
  Typography,
  FormHelperText,
  Switch,
  Button,
  Avatar,
  Chip,
  IconButton,
  Divider
} from '@mui/material'
import { styled } from '@mui/material/styles'
import PublicIcon from '@mui/icons-material/Public'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { lpApi, ogzApi } from '../../apis'
import { useSnackbar } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import vars from '../../config/vars'

const PUBLIC = 'public'
const ALLOW_CLONE = 'allow_clone'

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}))

const Setting = (props, ref) => {
  const { data } = props
  const [openSetting, setOpenSetting] = React.useState(false)
  const [isPublic, setIsPublic] = React.useState(data.isPublic)
  const [allowClone, setAllowClone] = React.useState(data.allowClone)
  const [editors, setEditors] = React.useState({})
  const [members, setMembers] = React.useState({})
  const { t } = useTranslation('common')

  const { pathname } = useLocation()
  const ogzMode = pathname.includes('organizations')

  const { openSnackbar } = useSnackbar()
  const params = useParams()
  const navigate = useNavigate()

  const submitChangeSetting = async (value, type) => {
    let setting
    if (type === PUBLIC) {
      setting = { public: value }
      setIsPublic(value)
    }
    if (type === ALLOW_CLONE) {
      setting = { allowClone: value }
      setAllowClone(value)
    }
    const { status, data } = await lpApi.editLP(params.id, setting)
    if (status !== HTTP_STATUS.OK) {
      if (type === ALLOW_CLONE) {
        setAllowClone(allowClone)
      }
      if (type === PUBLIC) {
        setIsPublic(isPublic)
      }
      openSnackbar(SNACKBAR.ERROR, 'Error while change setting')
    }
  }

  React.useImperativeHandle(ref, () => ({
    openSetting() {
      setOpenSetting(true)
    }
  }))

  const getMembers = async () => {
    try {
      const { status, data } = await ogzApi.getMembers(params.ogzId)
      if (status === HTTP_STATUS.OK) {
        setMembers(data.reduce((res, cur) => ({ ...res, [cur._id]: cur }), {}))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getEditors = async () => {
    try {
      const { status, data } = await lpApi.getEditors(params.id)
      if (status === HTTP_STATUS.OK) {
        setEditors(data.reduce((res, cur) => ({ ...res, [cur._id]: cur }), {}))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submitAddEditor = async (userId) => {
    try {
      const { status, data } = await lpApi.addEditor(params.id, userId)
      if (status === HTTP_STATUS.OK) {
        setEditors({ ...editors, [userId]: true })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submitRemoveEditor = async (userId) => {
    try {
      const { status, data } = await lpApi.removeEditor(params.id, userId)
      if (status === HTTP_STATUS.OK) {
        setEditors({ ...editors, [userId]: false })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submitDeleteCourse = async () => {
    try {
      const { status, data } = await lpApi.deleteLP(params.id)
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Delete successfully')
        navigate(-1)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  React.useEffect(() => {
    if (ogzMode) {
      getMembers()
      getEditors()
    }
  }, [])
  return (
    <Dialog
      open={openSetting}
      onClose={() => setOpenSetting(false)}
      PaperProps={{ sx: { minWidth: 600, minHeight: 400 } }}>
      <DialogTitle>{t('learningPath.setting')}</DialogTitle>
      <DialogContent>
        <FormGroup>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PublicIcon />
              <Typography sx={{ ml: 1 }}>{t('learningPath.public')}</Typography>
            </Box>
            <Android12Switch
              checked={isPublic}
              onChange={(e) => submitChangeSetting(e.target.checked, PUBLIC)}
            />
          </Box>
        </FormGroup>
        <FormHelperText sx={{ mb: 2 }}>{t('learningPath.publicDes')}</FormHelperText>
        <FormGroup>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ContentCopyIcon />
              <Typography sx={{ ml: 1 }}>{t('learningPath.allowClone')}</Typography>
            </Box>
            <Android12Switch
              checked={allowClone}
              onChange={(e) => submitChangeSetting(e.target.checked, ALLOW_CLONE)}
            />
          </Box>
        </FormGroup>
        <FormHelperText sx={{ mb: 2 }}>{t('learningPath.allowCloneDes')}</FormHelperText>
        <FormGroup>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteRoundedIcon color="error" />
              <Typography color="error" sx={{ ml: 1 }}>
              {t('learningPath.delete')}
              </Typography>
            </Box>
            <IconButton onClick={submitDeleteCourse} color="error">
              <DeleteRoundedIcon />
            </IconButton>
          </Box>
        </FormGroup>
        <FormHelperText sx={{ mb: 2, color: 'red' }}>{t('learningPath.deleteDes')}</FormHelperText>
        {ogzMode && (
          <FormGroup>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon />
                <Typography sx={{ ml: 1 }}>{t('learningPath.editors')}</Typography>
              </Box>
            </Box>
          </FormGroup>
        )}
        {ogzMode && <FormHelperText>{t('learningPath.editorDes')}</FormHelperText>}
        {ogzMode && (
          <Box sx={{ pl: 4 }}>
            {/* <Box
              sx={{
                my: 2,
                textTransform: 'none',
                width: '100%',
                border: '2px solid #c5dfff',
                background: 'rgba(25, 118, 210, 0.04)',
                display: 'flex',
                alignItems: 'center',
                p: 0.2,
                borderRadius: 1,
                justifyContent: 'space-between',
                color: (theme) => theme.palette.primary.main
              }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  alt={data.owner.name}
                  src={`${vars.server}/resources/avatars/${data.owner._id}/64x64${data.owner.avatar}`}
                />
                <Typography sx={{ fontSize: 14, fontWeight: 'bold', ml: 1 }}>
                  {data.owner.name}
                </Typography>
              </Box>
              <Box>
                <Chip
                  label={'Creator'}
                  size="small"
                  sx={{ fontSize: 12, color: (theme) => theme.palette.primary.main, mr: 2 }}
                />
              </Box>
            </Box> */}
            {Object.entries(members).map(([memberId, member], index) => {
              const isEditor = !!editors[memberId]
              const isAdmin = member.role === 'ADMIN'
              return (
                <Box
                  key={memberId}
                  sx={{
                    mt: 2,
                    textTransform: 'none',
                    width: '100%',
                    border: `2px solid ${isEditor || isAdmin ? '#c5dfff' : 'lightgrey'}`,
                    background: isEditor ? 'rgba(25, 118, 210, 0.04)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    p: 0.2,
                    borderRadius: 1,
                    justifyContent: 'space-between',
                    color: (theme) => (isEditor || isAdmin ? theme.palette.primary.main : '#999')
                  }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{ width: 40, height: 40 }}
                      alt={member.name}
                      src={`${vars.server}/resources/avatars/${memberId}/64x64${member.avatar}`}
                    />
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold', ml: 1 }}>
                      {member.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Chip
                      label={t(`organization.members.${member.role.toLowerCase()}`)}
                      size="small"
                      sx={{
                        fontSize: 12,
                        color: (theme) =>
                          isEditor || isAdmin ? theme.palette.primary.main : '#999',
                        mr: 2
                      }}
                    />
                    {!isAdmin && isEditor && (
                      <IconButton
                        size="small"
                        sx={{ color: 'lightgreen' }}
                        onClick={() => submitRemoveEditor(memberId)}>
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    {!isAdmin && !isEditor && (
                      <IconButton size="small" onClick={() => submitAddEditor(memberId)}>
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
export default React.forwardRef(Setting)
