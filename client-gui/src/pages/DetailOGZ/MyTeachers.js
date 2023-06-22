import * as React from 'react'
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Chip
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import GroupsIcon from '@mui/icons-material/Group'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Member from './Member'
import { userApi, ogzApi } from '../../apis'
import { HTTP_STATUS, COLLABORATOR_TYPE } from '../../constants'
import vars from '../../config/vars'
import { useAuth } from '../../contexts'

const MyTeachers = (props) => {
  const { youAreAdmin, setYouAreAdmin } = props
  const { t } = useTranslation('common')
  const [members, setMembers] = React.useState(props.members)
  const [findEmail, setFindEmail] = React.useState('')
  const [findRs, setFindRs] = React.useState([])
  const [openDialog, setOpenDialog] = React.useState(false)
  const [memberIds, setMemberIds] = React.useState([])
  const [memberRoles, setMemberRoles] = React.useState({})
  const { ogzId } = useParams()
  const auth = useAuth()
  const handleChangeRole = (id, value) => {
    setMemberRoles({ ...memberRoles, [id]: value })
  }

  const findUsers = async (email) => {
    if (email === '') return
    try {
      const { status, data } = await userApi.getUsersByEmail(email)
      if (status === HTTP_STATUS.OK) {
        setFindRs(data.reduce((res, cur) => ({ ...res, [cur._id]: cur }), {}))
        const newRoles = data.reduce(
          (res, cur) => ({ ...res, [cur._id]: COLLABORATOR_TYPE.MEMBER }),
          {}
        )
        setMemberRoles({ ...newRoles, ...memberRoles })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeFindEmail = (e) => {
    setFindEmail(e.target.value)
  }

  const handleKeyUpEmail = async (e) => {
    if (e.key === 'Enter') {
      await findUsers(findEmail)
    }
  }

  const sendInviteEmail = async (userId) => {
    try {
      const { status, data } = await ogzApi.addMember(ogzId, {
        user: findRs[userId],
        role: memberRoles[userId]
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const removeMember = (index) => {
    const newMemberList = [...members.slice(0, index), ...members.slice(index + 1)]
    setMembers(newMemberList)
  }

  React.useEffect(() => {
    setMembers(props.members)
    setMemberIds(props.members.map((mem) => mem.user._id))
    setMemberRoles({
      ...props.members.reduce((res, cur) => ({ ...res, [cur.user._id]: cur.role }), {})
    })
  }, [props.members])
  return (
    <Box sx={{ mb: 3, background: 'white', borderRadius: 3, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupsIcon />
          <Typography
            sx={{ ml: 1, color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
            {t('organization.members.members')}
          </Typography>
        </Box>
        {youAreAdmin && (
          <Button
            size="small"
            onClick={() => setOpenDialog(true)}
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
            {t('organization.members.addMember')}
          </Button>
        )}
      </Box>
      <Grid sx={{ p: 2 }} container spacing={{ xs: 1 }}>
        <Grid item xs={3}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'lightslategray',
              textTransform: 'uppercase'
            }}>
            {t('organization.members.name')}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'lightslategray',
              textTransform: 'uppercase'
            }}>
            {t('organization.members.email')}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'lightslategray',
              textTransform: 'uppercase'
            }}>
            {t('organization.members.role')}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'lightslategray',
              textTransform: 'uppercase'
            }}>
            {t('organization.members.action')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 1, color: 'rgb(240 242 245)' }} />
        </Grid>
        {console.log('members: ', members)}
        {members &&
          members.map((member, index) => (
            <Member
              youAreAdmin={youAreAdmin}
              key={index}
              data={member}
              setYouAreAdmin={setYouAreAdmin}
              removeMember={() => removeMember(index)}
            />
          ))}
      </Grid>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ sx: { minWidth: 600, minHeight: 300 } }}>
        <DialogTitle>{t('organization.members.findMember')}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, color: 'lightslategray' }}>
            {t('organization.members.findMemberNote')}
          </Typography>
          <TextField
            size="small"
            label={t('organization.members.emallName')}
            placeholder={t('organization.members.emallName')}
            value={findEmail}
            onChange={handleChangeFindEmail}
            fullWidth
            onKeyUp={handleKeyUpEmail}
            sx={{ mt: 2 }}
          />
          <Box>
            {Object.entries(findRs).map(([userId, user], index) => {
              const isMember = memberIds.includes(userId)
              return (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{ p: 1, display: 'flex', justifyContent: 'space-between', m: 1 }}>
                  <Link
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    to={`/profile/${userId}`}>
                    <Avatar
                      sx={{ width: 40, height: 40, mr: 1 }}
                      alt={user.name}
                      src={'https://mui.com/static/images/cards/contemplative-reptile.jpg'}
                    />
                    <Box>
                      <Typography
                        sx={{ color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
                        {user.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'lightgrey' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Link>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl size="small">
                      <InputLabel id="collaborator-type">
                        {t('organization.members.role')}
                      </InputLabel>
                      <Select
                        disabled={isMember}
                        onChange={(e) => handleChangeRole(userId, e.target.value)}
                        sx={{ fontSize: 11, borderRadius: 10, mr: 1 }}
                        labelId="collaborator-type"
                        label={t('organization.members.role')}
                        value={memberRoles[userId] || COLLABORATOR_TYPE.MEMBER}>
                        {Object.entries(COLLABORATOR_TYPE).map(([type, value], index) => (
                          <MenuItem sx={{ fontSize: 12 }} key={index} value={type}>
                            {t(`organization.members.${type.toLowerCase()}`)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      onClick={() => sendInviteEmail(userId)}
                      disabled={isMember}
                      size="small"
                      sx={{
                        color: '#6c68f3',
                        background: 'white',
                        border: !isMember ? '2px solid #6c68f3' : '2px solid #ddd',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'white'
                        }
                      }}>
                      {t('organization.members.sendEmail')}
                    </Button>
                  </Box>
                </Paper>
              )
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
export default MyTeachers
