import * as React from 'react'
import {
  MenuItem,
  Select,
  InputBase,
  Box,
  IconButton,
  Badge,
  TextField,
  Button
} from '@mui/material'
import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LanguageIcon from '@mui/icons-material/Language'
import PersonIcon from '@mui/icons-material/Person'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { styled as styledMui, alpha } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { learningActionApi } from '../../../apis'
import { HTTP_STATUS, SNACKBAR, ACTION } from '../../../constants'
import { useSnackbar, useDesigner } from '../../../contexts'
import { getData } from '../../../utils/localStorage'

const user = getData('user')

const Container = styled.div`
  margin-bottom: 8px;
  border-radius: 10px;
  padding: 8px;
  background: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};
  width: 350px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
`
const SmallSelect = styledMui(Select)(() => ({
  fontSize: 12,
  marginRight: 2,
  borderRadius: 0
}))

const SmallSelectOption = styledMui(MenuItem)(() => ({
  padding: 1,
  fontSize: 12
}))

const CustomCell = styledMui(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 1,
    fontSize: 12,
    paddingTop: '8px',
    width: 30,
    marginLeft: 5,
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 1)} 0 0 0 0.1rem`,
      borderColor: theme.palette.primary.main
    }
  }
}))

export const Name = styledMui(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontSize: 14,
    padding: '5px 2px',
    margin: '5px 0px',
    fontWeight: 500,
    '&:focus': {
      border: '2px solid #2979ff',
      borderColor: theme.palette.primary.main,
      background: 'white'
    },
    '&:hover': {
      // border: '2px solid #2979ff',
      borderColor: theme.palette.primary.main,
      background: 'white'
    }
  }
}))

const Task = (props) => {
  const { setNewActivity, lessonPartId } = props
  const [name, setName] = React.useState('')
  const [action, setAction] = React.useState(Object.keys(ACTION)[0])
  const [time, setTime] = React.useState(0)
  const [online, setOnline] = React.useState(false)
  const [resources, setResources] = React.useState({})
  const [students, setStudents] = React.useState(0)
  const [description, setDescription] = React.useState('')
  const { openSnackbar } = useSnackbar()
  const { lesson: lessonId, id: learningPathId } = useParams()
  const { columns, setColumns, tasks, setTasks, pushHistory } = useDesigner()
  const { t } = useTranslation('common')

  const submitNewAction = async () => {
    if (name.length === 0) {
      openSnackbar(SNACKBAR.WARNING, 'Name can not be empty')
      return
    }
    try {
      const {
        status,
        data: { createdAction, updateHistory }
      } = await learningActionApi.createLearningAction(learningPathId, lessonId, lessonPartId, {
        name,
        action,
        time,
        online,
        resources,
        students,
        description
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Create activity sucessfully')
        setTasks({ ...tasks, [createdAction._id]: { ...createdAction, id: createdAction._id } })
        setColumns({
          ...columns,
          [lessonPartId]: {
            ...columns[lessonPartId],
            taskIds: [...columns[lessonPartId].taskIds, createdAction._id]
          }
        })
        pushHistory({ ...updateHistory, user })
      }
      setNewActivity(false)
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'ERROR')
    }
  }

  return (
    <Container>
      <Name
        placeholder={t('learningAction.newName')}
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Box className="head" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <SmallSelect size="small" value={action} onChange={(e) => setAction(e.target.value)}>
          {Object.entries(ACTION).map(([id, name], index) => (
            <SmallSelectOption key={index} value={id}>
              {t(`learningAction.${id}`)}
            </SmallSelectOption>
          ))}
        </SmallSelect>
        <Box
          sx={{
            pl: 1,
            mr: 0.3,
            border: '0.3px solid lightgrey',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <AccessTimeIcon fontSize="small" />
          <CustomCell
            type="number"
            value={time}
            onChange={(e) => setTime(parseInt(e.target.value))}
          />
        </Box>
        <Box
          sx={{
            pl: 1,
            mr: 0.3,
            border: '0.3px solid lightgrey',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <PersonIcon fontSize="small" />
          <CustomCell
            type="number"
            value={students}
            onChange={(e) => setStudents(parseInt(e.target.value))}
          />
        </Box>
        <IconButton
          color={online ? 'success' : 'default'}
          aria-label="delete"
          sx={{ height: 20, width: 20 }}
          size="small">
          <LanguageIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          // onClick={handleOpenResource}
          aria-label="delete"
          sx={{ height: 20, width: 20 }}
          size="small">
          <Badge
            sx={{
              '& .MuiBadge-badge': {
                fontSize: 8,
                height: 15,
                top: 8,
                right: -5,
                minWidth: 15
              }
            }}
            badgeContent={resources.length}
            color="info">
            <AttachmentIcon fontSize="inherit" />
          </Badge>
        </IconButton>
      </Box>
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        placeholder={t('learningAction.descriptionn')}
        InputProps={{
          sx: {
            fontSize: 12,
            p: 1,
            mt: 1,
            borderRadius: 0
          }
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          onClick={submitNewAction}
          sx={{
            fontSize: 13,
            textTransform: 'none',
            mt: 1,
            width: 50,
            height: 30,
            boxShadow: 'none',
            mr: 1
          }}>
          OK
        </Button>
        <Button
          size="small"
          onClick={() => setNewActivity(false)}
          sx={{
            fontSize: 13,
            textTransform: 'none',
            width: 50,
            height: 30,
            mt: 1
          }}>
          {t('learningAction.cancel')}
        </Button>
      </Box>
    </Container>
  )
}

export default React.memo(Task)
