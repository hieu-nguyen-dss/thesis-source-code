import * as React from 'react'
import styled from '@emotion/styled'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Typography, Box, Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Column, { Drag, Title } from './Column'
import { useDesigner, useSnackbar } from '../../../contexts'
import { HTTP_STATUS, LIGHT_COLOR_PALLETE, SNACKBAR } from '../../../constants'
import { lessonPartApi, lessonApi } from '../../../apis'
import { getData } from '../../../utils/localStorage'

const user = getData('user')

const Container = styled.div`
  display: flex;
`

const Board = (props) => {
  const { t } = useTranslation('common')
  const { openSnackbar } = useSnackbar()
  const {
    columns,
    setColumns,
    columnOrder,
    setColumnOrder,
    tasks: allTasks,
    pushHistory,
    editable
  } = useDesigner()
  const { lesson } = useParams()

  const [newGA, setNewGA] = React.useState(false)
  const [newLessonPartName, setNewLessonPartName] = React.useState('')

  const updateColumnOrder = async (newColumnOrder) => {
    try {
      const { status, data } = await lessonApi.updateLesson(lesson, { lessonParts: newColumnOrder })
      if (status !== HTTP_STATUS.OK) {
        setColumnOrder(columnOrder)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateTaskOrder = async (columnId, newTaskOrder) => {
    try {
      const { status, data } = await lessonPartApi.updateLessonPart(columnId, {
        learningActions: newTaskOrder
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onDragEnd = async (result) => {
    const { destination: des, source: src, draggableId: dragId, type } = result
    if (!des) return
    if (des.droppableId === src.droppableId && des.index === src.index) return

    const srcColumn = columns[src.droppableId]
    const desColumn = columns[des.droppableId]

    if (type === 'COLUMN') {
      const copyColumnOrder = [...columnOrder]
      copyColumnOrder.splice(src.index, 1)
      copyColumnOrder.splice(des.index, 0, dragId)
      setColumnOrder(copyColumnOrder)
      return await updateColumnOrder(copyColumnOrder)
    }

    if (srcColumn === desColumn) {
      const column = columns[src.droppableId]
      const taskIds = [...column.taskIds]
      taskIds.splice(src.index, 1)
      taskIds.splice(des.index, 0, dragId)
      const newColumn = {
        ...column,
        taskIds
      }
      setColumns({
        ...columns,
        [src.droppableId]: newColumn
      })
      return await updateTaskOrder(src.droppableId, taskIds)
    }

    const srcTaskIds = [...srcColumn.taskIds]
    const desTaskIds = [...desColumn.taskIds]
    srcTaskIds.splice(src.index, 1)
    desTaskIds.splice(des.index, 0, dragId)
    const newSrcColumn = {
      ...srcColumn,
      taskIds: srcTaskIds
    }
    const newDesColumn = {
      ...desColumn,
      taskIds: desTaskIds
    }
    setColumns({
      ...columns,
      [src.droppableId]: newSrcColumn,
      [des.droppableId]: newDesColumn
    })
    await Promise.all([
      updateTaskOrder(src.droppableId, srcTaskIds),
      updateTaskOrder(des.droppableId, desTaskIds)
    ])
  }

  const submitNewGA = async () => {
    if (newLessonPartName.length === 0) {
      openSnackbar(SNACKBAR.WARNING, 'Name cannot be empty')
      return
    }
    try {
      const {
        status,
        data: { createdPart, updateHistory }
      } = await lessonPartApi.createLessonPart(lesson, newLessonPartName)
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Create group action successfully !')
        setColumns({
          ...columns,
          [createdPart._id]: {
            id: createdPart._id,
            name: createdPart.name,
            taskIds: createdPart.learningActions
          }
        })
        setColumnOrder([...columnOrder, createdPart._id])
        pushHistory({ ...updateHistory, user })
      }
      setNewGA(false)
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Fail')
    }
  }

  const cancelNewGA = () => {
    setNewGA(false)
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          p: 1,
          background: '#efefef',
          borderRadius: 2
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ListAltOutlinedIcon />
          <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', ml: 1 }}>
            {t('lesson.activities')}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided, snapshot) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {columnOrder &&
                  columns &&
                  allTasks &&
                  columnOrder.map((columnId, index) => {
                    const column = columns[columnId]
                    const tasks = column.taskIds.map((taskId) => allTasks[taskId])
                    return <Column index={index} key={columnId} column={column} tasks={tasks} />
                  })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
        {editable && (
          <Box>
            <Button
              onClick={() => setNewGA(true)}
              startIcon={<AddIcon />}
              size="small"
              sx={{
                width: 200,
                color: '#6c68f3',
                background: 'white',
                border: '2px solid #6c68f3',
                textTransform: 'none',
                mt: 2,
                '&:hover': {
                  background: 'white'
                }
              }}>
              {t('lesson.newGroupActivity')}
            </Button>
            {newGA && (
              <>
                <Box sx={{ background: '#eee', mt: 1, pb: 1, width: 350 }}>
                  <Drag backgroundColor={LIGHT_COLOR_PALLETE[0]}></Drag>
                  <Title
                    value={newLessonPartName}
                    onChange={(e) => setNewLessonPartName(e.target.value)}
                    autoFocus
                    placeholder={t('lesson.groupActName')}
                    fullWidth
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={submitNewGA}
                    size="small"
                    sx={{
                      color: '#6c68f3',
                      background: 'white',
                      border: '2px solid #6c68f3',
                      textTransform: 'none',
                      mt: 2,
                      mr: 1.5,
                      '&:hover': {
                        background: 'white'
                      }
                    }}>
                    OK
                  </Button>
                  <Button
                    onClick={cancelNewGA}
                    size="small"
                    sx={{
                      color: '#6c68f3',
                      background: 'white',
                      border: '2px solid #6c68f3',
                      textTransform: 'none',
                      mt: 2,
                      '&:hover': {
                        background: 'white'
                      }
                    }}>
                    {t('lesson.cancel')}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </React.Fragment>
  )
}

export default Board
