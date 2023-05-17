import * as React from 'react'
import styledd from '@emotion/styled'
import {
  InputBase,
  Button,
  Box,
  IconButton,
  Popover,
  LinearProgress,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteForever'
import WarningIcon from '@mui/icons-material/Warning'
import { styled } from '@mui/material/styles'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LIGHT_COLOR_PALLETE, SNACKBAR, HTTP_STATUS } from '../../../constants'
import { useSnackbar, useDesigner } from '../../../contexts'
import { lessonPartApi } from '../../../apis'
import { getData } from '../../../utils/localStorage'

import Task from './Task'
import NewTask from './NewTask'

const user = getData('user')

const Container = styledd.div`
  margin: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: #eee;
  min-width: 366px
`
export const Drag = styledd.div`
  height: 30px;
  width: '100%';
  background-image: url(https://a.trellocdn.com/prgb/dist/images/patterns/dark/StripeDiagonal.5ffecc7a1e7c961c0da7.svg);
  background-color: ${(props) => props.backgroundColor};
  background-size: 20px 20px;
  background-repeat: repeat-y;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-radius: 8px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
`
const TaskList = styledd.div`
  padding: 8px;
  flex-grow: 1;
  min-height: 50px;
  transition: background-color ease 0.2s;
  max-height: 450px;
  overflow: auto 
`
export const Title = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 5,
    fontSize: 14,
    padding: '8px 2px',
    margin: '5px 10px 0px 10px',
    fontWeight: 500,
    '&:focus': {
      borderColor: theme.palette.primary.main,
      background: 'white'
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
      background: 'white'
    }
  }
}))

const DisabledTitle = styled(Box)(({ theme }) => ({
  borderRadius: 5,
  fontSize: 14,
  padding: '8px 2px',
  margin: '5px 10px 0px 10px',
  fontWeight: 500,
  textTransform: 'uppercase'
}))

const Column = ({ index, column, tasks }) => {
  const [title, setTitle] = React.useState(column.name)
  const [newActivity, setNewActivity] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [deleting, setDeleting] = React.useState(false)
  const { lesson: lessonId } = useParams()
  const { openSnackbar } = useSnackbar()
  const {
    setTasks,
    columns,
    setColumns,
    setColumnOrder,
    columnOrder,
    tasks: allTasks,
    editable,
    pushHistory
  } = useDesigner()
  const { t } = useTranslation('common')

  const submitRenameColumn = async () => {
    if (title === '') {
      openSnackbar(SNACKBAR.WARNING, 'Name can not be empty')
      setTitle(column.name)
      return
    }
    if (title === column.name) {
      return
    }
    try {
      console.log(column.id)
      const { status, data } = await lessonPartApi.updateLessonPart(lessonId, column.id, {
        name: title
      })
      if (status !== HTTP_STATUS.OK) {
        setTitle(column.name)
        openSnackbar(SNACKBAR.ERROR, 'Try again')
        return
      }
      if (data.updateHistory) {
        pushHistory({ ...data.updateHistory, user })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submitDeleteColumn = async () => {
    setDeleting(true)
    try {
      const { status, data } = await lessonPartApi.deleteLessonPart(
        lessonId,
        column.id,
        column.taskIds,
        title
      )
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Delete successfully')
        const copyColumns = { ...columns }
        delete copyColumns[column.id]
        const copyTasks = { ...allTasks }
        for (const id of column.taskIds) {
          delete copyTasks[id]
        }
        setColumnOrder(columnOrder.filter((columnId) => columnId !== column.id))
        setColumns(copyColumns)
        setTasks(copyTasks)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }

  return (
    <Draggable draggableId={column.id} index={index} type="COLUMN" isDragDisabled={!editable}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Drag
            {...provided.dragHandleProps}
            backgroundColor={LIGHT_COLOR_PALLETE[(index + 2) % 4]}>
            {editable && (
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </Drag>
          {editable && (
            <Title
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => submitRenameColumn()}
            />
          )}
          {!editable && <DisabledTitle>{title}</DisabledTitle>}
          <Droppable droppableId={column.id} type="TASK">
            {(provided, snapshot) => (
              <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index1) => (
                  <Task
                    index={index1}
                    key={task.id}
                    task={task}
                    columnId={column.id}
                    backgroundColor={LIGHT_COLOR_PALLETE[(index + 2) % 4]}
                  />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          {editable && (
            <Box sx={{ width: '100%', p: 1 }}>
              {newActivity && <NewTask setNewActivity={setNewActivity} lessonPartId={column.id} />}
              <Button
                onClick={() => setNewActivity(true)}
                sx={{
                  width: 'calc(100% - 16px)',
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  mt: 2,
                  '&:hover': {
                    background: 'white'
                  }
                }}>
                {t('lesson.newActivity')}
              </Button>
            </Box>
          )}
          <Popover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <Box sx={{ m: 2 }}>
              <WarningIcon color="warning" />
              <Typography>{t('lesson.cannotUndo')}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', m: 2 }}>
              <Button
                onClick={submitDeleteColumn}
                size="small"
                variant="contained"
                color="warning"
                sx={{ textTransform: 'none', mr: 1 }}>
                {t('lesson.delete')}
              </Button>
              <Button
                onClick={() => setAnchorEl(null)}
                size="small"
                variant="outlined"
                sx={{ textTransform: 'none' }}>
                {t('lesson.cancel')}
              </Button>
            </Box>
            {deleting && <LinearProgress color="warning" />}
          </Popover>
        </Container>
      )}
    </Draggable>
  )
}

export default Column
