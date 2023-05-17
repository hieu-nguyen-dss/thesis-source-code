import * as React from 'react'
import {
  MenuItem,
  Select,
  InputBase,
  Box,
  IconButton,
  Badge,
  TextField,
  Popover,
  Typography,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  ImageList,
  ImageListItem,
  Checkbox,
  Tooltip,
  DialogActions
} from '@mui/material'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LanguageIcon from '@mui/icons-material/Language'
import PersonIcon from '@mui/icons-material/Person'
import AttachmentIcon from '@mui/icons-material/Attachment'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { FileIcon, defaultStyles } from 'react-file-icon'
import { styled as styledMui, alpha } from '@mui/material/styles'
import { Draggable } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { learningActionApi } from '../../../apis'
import { HTTP_STATUS, SNACKBAR, ACTION, ACTION_COLOR } from '../../../constants'
import { useSnackbar, useDesigner } from '../../../contexts'
import vars from '../../../config/vars'

const Drag = styled.div`
  // height: 20px;
  min-height: 20px;
  width: '100%';
  background-image: url(https://a.trellocdn.com/prgb/dist/images/patterns/dark/BrickHorizontal.99c5ab702a871cfced80.svg);
  background-color: ${(props) => props.backgroundColor};
  background-size: 20px 20px;
  background-repeat: no-repeat;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const Container = styled.div`
  margin-bottom: 8px;
  border-radius: 10px;
  // padding: 8px;
  background: white;
  width: 350px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
`
const SmallSelect = styledMui(Select)(() => ({
  fontSize: 12,
  marginRight: 2,
  borderRadius: 3
}))

const SmallSelectOption = styledMui(MenuItem)(() => ({
  padding: 1,
  fontSize: 12
}))

const CustomCell = styledMui(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 3,
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
    flexGrow: 1,
    fontSize: 14,
    padding: '5px 2px',
    margin: '5px 0px',
    fontWeight: 'bold',
    borderRadius: 1,
    border: '1.5px solid white',
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

const DisabledName = styledMui(Box)(() => ({
  fontSize: 14,
  padding: '5px 2px',
  margin: '5px 0px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  border: '2px solid white',
  flexGrow: 1
}))

const DisabledInfo = styledMui(Box)(({ theme }) => ({
  borderRadius: 1,
  fontSize: 13,
  marginLeft: 5,
  marginRight: 5
}))

const Task = ({ columnId, index, task, backgroundColor }) => {
  const [name, setName] = React.useState(task.name)
  const [lastestName, setLastestName] = React.useState(task.name)
  const [action, setAction] = React.useState(task.action)
  const [lastestAction, setLastestAction] = React.useState(task.action)
  const [time, setTime] = React.useState(task.time)
  const [lastestTime, setLastestTime] = React.useState(task.time)
  const [online, setOnline] = React.useState(task.online)
  const [resources, setResources] = React.useState(task.resources || {})
  const [students, setStudents] = React.useState(task.students)
  const [lastestStudent, setLastestStudent] = React.useState(task.students)
  const [description, setDescription] = React.useState(task.description)
  const [lastestDescription, setLastestDescription] = React.useState(task.description)
  const [completed, setCompleted] = React.useState(task.completed)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [deleting, setDeleting] = React.useState(false)
  const [openResources, setOpenResources] = React.useState(false)
  const [resourcesByType, setResourcesByType] = React.useState({})
  const { openSnackbar } = useSnackbar()
  const {
    tasks,
    setTasks,
    columns,
    setColumns,
    resources: lessonResources,
    editable
  } = useDesigner()
  const { lesson: lessonId, id: learningPathId } = useParams()
  const { t } = useTranslation('common')

  const groupResourceByType = () => {
    const rs = lessonResources.reduce((res, cur) => {
      if (cur.type.includes('image')) {
        return { ...res, imgs: [...(res.imgs || []), cur] }
      } else {
        return { ...res, others: [...(res.others || []), cur] }
      }
    }, {})
    console.log(resources)
    setResourcesByType(rs)
  }

  const deleteFromColumn = () => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        taskIds: columns[columnId].taskIds.filter((taskId) => taskId !== task.id)
      }
    })
  }

  const deleteFromTasks = () => {
    const copyTasks = { ...tasks }
    delete copyTasks[task.id]
    setTasks(copyTasks)
  }

  const submitDeleteTask = async () => {
    setDeleting(true)
    try {
      const { status, data } = await learningActionApi.deleteLearningAction(
        learningPathId,
        lessonId,
        columnId,
        task.id,
        name,
        completed
      )
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Delete action successfully')
        console.log(data)
        deleteFromColumn()
        deleteFromTasks()
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }

  const submitUpdate = async (updateData) => {
    try {
      return await learningActionApi.updateLearningAction(
        learningPathId,
        lessonId,
        task.id,
        updateData
      )
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }

  const submitRenameAction = async () => {
    if (name === '' || name === lastestName) return
    const { status, data } = await submitUpdate({ name })
    if (status !== HTTP_STATUS.OK) {
      setName(lastestName)
    } else {
      setLastestName(name)
    }
  }

  const submitChangeActionType = async () => {
    if (action === lastestAction) return
    const { status, data } = await submitUpdate({ action })
    if (status !== HTTP_STATUS.OK) {
      setAction(lastestAction)
      setTasks({ ...tasks, [task.id]: { ...tasks[task.id], action: lastestAction } })
    } else {
      setLastestAction(action)
    }
  }

  const handleChangeAction = (e) => {
    setAction(e.target.value)
    setTasks({ ...tasks, [task.id]: { ...tasks[task.id], action: e.target.value } })
  }

  const submitChangeOnline = async () => {
    if (!editable) return
    setOnline(!online)
    const { status, data } = await submitUpdate({
      online: !online
    })
    if (status !== HTTP_STATUS.OK) {
      setOnline(online)
    }
  }

  const submitChangeTime = async () => {
    if (time <= 0 || time === lastestTime) {
      setTime(lastestTime)
      return
    }
    const { status, data } = await submitUpdate({ time })
    if (status !== HTTP_STATUS.OK) {
      setTime(lastestTime)
    } else {
      setLastestTime(time)
    }
  }

  const submitChangeStudents = async () => {
    if (students <= 0 || students === lastestStudent) {
      setStudents(lastestStudent)
      return
    }
    const { status, data } = await submitUpdate({ students })
    if (status !== HTTP_STATUS.OK) {
      setStudents(lastestStudent)
    } else {
      setLastestStudent(students)
    }
  }

  const submitChangeDescription = async () => {
    if (description === lastestDescription) {
      return
    }
    const { status, data } = await submitUpdate({
      description
    })
    if (status !== HTTP_STATUS.OK) {
      setDescription(lastestDescription)
    } else {
      setLastestDescription(description)
    }
  }

  const submitChangeCompleted = async () => {
    if (!editable) return
    setCompleted(!completed)
    const { status, data } = await submitUpdate({
      completed: !completed
    })
    if (status !== HTTP_STATUS.OK) {
      setCompleted(completed)
    }
  }

  const submitChangeResources = async () => {
    if (!editable) return
    const { status, data } = await submitUpdate({
      resources: resources
    })
    if (status === HTTP_STATUS.OK) {
      openSnackbar(SNACKBAR.SUCCESS, 'Updated resources')
    }
  }

  React.useEffect(() => {
    groupResourceByType()
  }, [lessonResources])

  return (
    <Draggable draggableId={task.id} index={index} type="TASK" isDragDisabled={!editable}>
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}>
          <Drag {...provided.dragHandleProps} backgroundColor={ACTION_COLOR[action]}>
            {editable && (
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ width: 20, height: 20 }}>
                <CloseIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            )}
          </Drag>
          <Box sx={{ display: 'flex' }}>
            {editable && (
              <Name
                placeholder={t('learningAction.newName')}
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={submitRenameAction}
              />
            )}
            {!editable && <DisabledName>{name}</DisabledName>}
            <Checkbox
              checked={completed}
              onChange={submitChangeCompleted}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleOutlineIcon />}
              sx={{ '&.MuiCheckbox-root': { color: 'green' } }}
            />
          </Box>
          <Box
            className="head"
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', m: 1 }}>
            {editable && (
              <SmallSelect
                size="small"
                value={action}
                onChange={handleChangeAction}
                onBlur={submitChangeActionType}>
                {Object.entries(ACTION).map(([id, name], index) => (
                  <SmallSelectOption key={index} value={id}>
                    {t(`learningAction.${id}`)}
                  </SmallSelectOption>
                ))}
              </SmallSelect>
            )}
            {!editable && <DisabledInfo>{t(`learningAction.${action}`)}</DisabledInfo>}
            <Box
              sx={{
                p: 0.2,
                pl: 1,
                mr: 0.3,
                border: '0.3px solid lightgrey',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 1
              }}>
              <AccessTimeIcon fontSize="small" />
              {editable && (
                <CustomCell
                  type="number"
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                  onBlur={submitChangeTime}
                />
              )}
              {!editable && <DisabledInfo>{time}</DisabledInfo>}
            </Box>
            <Box
              sx={{
                p: 0.2,
                pl: 1,
                mr: 0.3,
                border: '0.3px solid lightgrey',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 1
              }}>
              <PersonIcon fontSize="small" />
              {editable && (
                <CustomCell
                  type="number"
                  value={students}
                  onChange={(e) => setStudents(parseInt(e.target.value))}
                  onBlur={submitChangeStudents}
                />
              )}
              {!editable && <DisabledInfo>{students}</DisabledInfo>}
            </Box>
            <Tooltip title={t('learningAction.onlineOrOffline')}>
              <IconButton
                onClick={submitChangeOnline}
                color={online ? 'success' : 'default'}
                aria-label="delete"
                sx={{ height: 20, width: 20 }}
                size="small">
                <LanguageIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => setOpenResources(true)}
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
                badgeContent={
                  Object.entries(resources || {}).filter(([file, selected]) => selected === true)
                    .length
                }
                color="info">
                <AttachmentIcon fontSize="inherit" />
              </Badge>
            </IconButton>
          </Box>
          <Box sx={{ p: 1 }}>
            {editable && (
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={submitChangeDescription}
                fullWidth
                multiline
                placeholder={t('learningAction.descriptionn')}
                InputProps={{
                  sx: {
                    fontSize: 13,
                    p: 1,
                    borderRadius: 0
                  }
                }}
              />
            )}
            {!editable && <DisabledInfo>{description}</DisabledInfo>}
          </Box>
          <Popover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <Box sx={{ m: 2 }}>
              <WarningIcon color="warning" />
              <Typography>{t('learningAction.cannotUndo')}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', m: 2 }}>
              <Button
                onClick={submitDeleteTask}
                size="small"
                variant="contained"
                color="warning"
                sx={{ textTransform: 'none', mr: 1 }}>
                {t('learningAction.delete')}
              </Button>
              <Button
                onClick={() => setAnchorEl(null)}
                size="small"
                variant="outlined"
                sx={{ textTransform: 'none' }}>
                {t('learningAction.cancel')}
              </Button>
            </Box>
            {deleting && <LinearProgress color="warning" />}
          </Popover>
          <Dialog open={openResources} onClose={() => setOpenResources(false)}>
            <DialogTitle>{t('learningAction.resources')}</DialogTitle>
            <DialogContent>
              <ImageList cols={4}>
                {resourcesByType.imgs &&
                  resourcesByType.imgs.map((file, index) => (
                    <ImageListItem key={index} sx={{ alignItems: 'center' }}>
                      <img
                        src={`${vars.server}/resources/${lessonId}/${file.name}?w=164&h=164&fit=crop&auto=format`}
                        alt={file.name}
                        loading="lazy"
                      />
                      <Checkbox
                        disabled={!editable}
                        checked={!!resources[file.name]}
                        onChange={(e) =>
                          setResources({ ...resources, [file.name]: e.target.checked })
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </ImageListItem>
                  ))}
              </ImageList>
              {resourcesByType.others &&
                resourcesByType.others.map((file, index) => {
                  const ext = file.name.split('.').pop()
                  return (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        disabled={!editable}
                        checked={!!resources[file.name]}
                        onChange={(e) =>
                          setResources({ ...resources, [file.name]: e.target.checked })
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      <Box sx={{ width: 35, ml: 1 }}>
                        <FileIcon extension={ext} {...defaultStyles[ext]} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, ml: 1 }}>
                        {file.name}
                      </Typography>
                    </Box>
                  )
                })}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={submitChangeResources}
                size="small"
                sx={{
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'white'
                  }
                }}>
                {t('learningAction.save')}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </Draggable>
  )
}

export default React.memo(Task)
