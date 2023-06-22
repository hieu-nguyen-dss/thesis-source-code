import * as React from 'react'
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  ListItem,
  Popover
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Check,
  Close,
  SubdirectoryArrowRight,
  Delete
} from '@mui/icons-material'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LinearProgressWithLabel from '../../components/customs/LinearProgress'
import { useSnackbar } from '../../contexts'
import { partApi, lessonApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'

const TableContent = (props) => {
  const { allParts, editable, lessons, setLessons } = props
  const [parts, setParts] = React.useState(null)
  const [partIds, setPartIds] = React.useState(null)
  const [opens, setOpens] = React.useState(null)
  const [newPart, setNewPart] = React.useState(false)
  const [newPartName, setNewPartName] = React.useState('')
  const [newLessons, setNewLessons] = React.useState([])
  const [newLessonNames, setNewLessonNames] = React.useState({})
  const [submitting, setSubmiting] = React.useState(false)
  const [validNewPartName, setValidNewPartName] = React.useState(true)
  const [anchorDeletePart, setAnchorDeletePart] = React.useState(null)
  const [anchorDeleteLesson, setAnchorDeleteLesson] = React.useState(null)
  const [cDelPartId, setCDelPartId] = React.useState(null)
  const [cDelLessonId, setCDelLessonId] = React.useState(null)
  const { id: learningPathId } = useParams()
  const { openSnackbar } = useSnackbar()
  const { t } = useTranslation('common')

  React.useEffect(() => {
    let partIds = []
    let parts = {}
    let lessons = {}
    for (const part of allParts) {
      partIds = [...partIds, part._id]
      const lessonsOfParts = part.lessons.reduce((res, cur) => ({ ...res, [cur._id]: cur }), {})
      parts = {
        ...parts,
        [part._id]: {
          id: part._id,
          name: part.name,
          lessons: part.lessons.map((lesson) => lesson._id)
        }
      }
      lessons = { ...lessons, ...lessonsOfParts }
    }
    setParts(parts)
    setPartIds(partIds)
    setOpens([...Array(partIds.length).fill(false)])
    setNewLessons(partIds.reduce((r, c) => ({ ...r, [c]: false }), {}))
    setNewLessonNames(partIds.reduce((r, c) => ({ ...r, [c]: '' }), {}))
    setLessons(lessons)
  }, [])
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const handleOpen = (index) => {
    const copyOpen = Array.from(opens)
    copyOpen[index] = !copyOpen[index]
    setOpens(copyOpen)
  }
  const handleOpenLesson = (lessonId) => {
    navigate(`${pathname}/${lessonId}`)
  }

  const onChangeNewPartName = (e) => {
    setNewPartName(e.target.value)
  }

  const toggleAddNewPart = () => {
    setSubmiting(false)
    setNewPartName('')
    setNewPart(!newPart)
  }

  const submitAddNewPart = async () => {
    setSubmiting(true)
    if (newPartName.length === 0) {
      setValidNewPartName(false)
      return
    }
    const { data, status } = await partApi.createPart(learningPathId, newPartName)
    if (status === HTTP_STATUS.OK) {
      openSnackbar(SNACKBAR.SUCCESS, `Create ${newPartName} successfully!`)
      console.log({ ...parts, [data._id]: { ...data, id: data._id } })
      setParts({ ...parts, [data._id]: { ...data, id: data._id } })
      setPartIds([...partIds, data._id])
      toggleAddNewPart()
      return
    }
    openSnackbar(SNACKBAR.ERROR, 'Error')
    setSubmiting(false)
  }

  const submitDeletePart = async () => {
    try {
      const { status, data } = await partApi.deletePart(learningPathId, cDelPartId)
      if (status === HTTP_STATUS.OK) {
        setAnchorDeletePart(null)
        openSnackbar(SNACKBAR.SUCCESS, 'Deleted part')
        setPartIds(partIds.filter((partId) => partId !== cDelPartId))
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }
  const toggleAddNewLesson = (partId, index) => {
    if (!newLessons[partId]) {
      const copyOpen = Array.from(opens)
      copyOpen[index] = true
      setOpens(copyOpen)
    }
    setNewLessons({ ...newLessons, [partId]: !newLessons[partId] })
  }
  const onChangeNewLessonName = (partId, value) => {
    setNewLessonNames({ ...newLessonNames, [partId]: value })
  }
  const submitAddLesson = async (partId) => {
    if (newLessonNames[partId].length === 0) {
      openSnackbar(SNACKBAR.WARNING, 'Lesson name can not be empty')
    }
    try {
      const { status, data } = await lessonApi.createLesson(partId, newLessonNames[partId])
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, `Create lesson ${data.name} successfully !`)
        setLessons({ ...lessons, [data._id]: { id: data._id, name: data.name } })
        setParts({
          ...parts,
          [partId]: { ...parts[partId], lessons: [...parts[partId].lessons, data._id] }
        })
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }

  const submitDeleteLesson = async () => {
    try {
      const { status, data } = await lessonApi.deleteLesson(cDelPartId, cDelLessonId)
      if (status === HTTP_STATUS.OK) {
        setAnchorDeleteLesson(null)
        openSnackbar(SNACKBAR.SUCCESS, 'Deleted lesson')
        setParts({
          ...parts,
          [cDelPartId]: {
            ...parts[cDelPartId],
            lessons: parts[cDelPartId].lessons.filter((lesson) => lesson !== cDelLessonId)
          }
        })
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }

  return (
    <React.Fragment>
      <Typography textAlign={'center'}>{t('learningPath.tableOfContent')}</Typography>
      <List>
        {parts &&
          lessons &&
          partIds &&
          partIds.map((partId, index) => (
            <React.Fragment key={index}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <ListItemButton sx={{ flexGrow: 1 }} onClick={() => handleOpen(index)}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 'bold' }}>{`${index + 1}. ${
                        parts[partId].name
                      }`}</Typography>
                    }
                  />
                  <Typography
                    sx={{
                      mr: 3,
                      fontSize: 12,
                      color: '#aaa'
                    }}>{`${parts[partId].lessons.length} ${t('learningPath.lessons')}`}</Typography>
                  {opens[index] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {editable && (
                  <React.Fragment>
                    <IconButton
                      onClick={() => toggleAddNewLesson(partId, index)}
                      sx={{
                        color: '#6c68f3'
                      }}
                      size="small">
                      <SubdirectoryArrowRight />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        setCDelPartId(partId)
                        setAnchorDeletePart(e.currentTarget)
                      }}
                      sx={{
                        color: '#6c68f3'
                      }}
                      size="small">
                      <Delete />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorDeletePart)}
                      anchorEl={anchorDeletePart}
                      onClose={() => setAnchorDeletePart(null)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                      }}
                      PaperProps={{
                        sx: {
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end'
                        }
                      }}>
                      <Box>You cannnot restore this part</Box>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        size="small"
                        onClick={submitDeletePart}
                        color="error">
                        Delete
                      </Button>
                    </Popover>
                  </React.Fragment>
                )}
              </Box>
              <Collapse in={opens[index]} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {parts[partId] &&
                    parts[partId].lessons.map((lessonId, idx) => (
                      <ListItem key={lessonId}>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOpenLesson(lessonId)}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{`${lessons[lessonId].name}`}</Typography>
                                <LinearProgressWithLabel
                                  value={
                                    isNaN(
                                      lessons[lessonId].completedActions /
                                        lessons[lessonId].totalActions
                                    )
                                      ? 0
                                      : (lessons[lessonId].completedActions /
                                          lessons[lessonId].totalActions) *
                                        100
                                  }
                                />
                              </Box>
                            }
                          />
                        </ListItemButton>
                        <IconButton
                          onClick={(e) => {
                            setAnchorDeleteLesson(e.currentTarget)
                            setCDelLessonId(lessonId)
                            setCDelPartId(partId)
                          }}
                          size="small"
                          sx={{ color: '#6c68f3' }}>
                          <Delete />
                        </IconButton>
                        <Popover
                          open={Boolean(anchorDeleteLesson)}
                          anchorEl={anchorDeleteLesson}
                          onClose={() => setAnchorDeleteLesson(null)}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                          }}
                          PaperProps={{
                            sx: {
                              p: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end'
                            }
                          }}>
                          <Box>You cannnot restore this lesson</Box>
                          <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            size="small"
                            onClick={submitDeleteLesson}
                            color="error">
                            Delete
                          </Button>
                        </Popover>
                      </ListItem>
                    ))}
                  {newLessons[partId] && (
                    <ListItem>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                        <TextField
                          fullWidth
                          required={true}
                          value={newLessonNames[partId]}
                          onChange={(e) => onChangeNewLessonName(partId, e.target.value)}
                          size="small"
                          autoFocus
                          InputProps={{
                            sx: {
                              borderRadius: 1
                            }
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => submitAddLesson(partId)}
                          sx={{
                            color: '#6c68f3',
                            background: 'white',
                            border: '2px solid #6c68f3',
                            borderRadius: 1,
                            ml: 2,
                            '&:hover': { background: '#fff' }
                          }}>
                          <Check sx={{ width: 14, height: 14 }} />
                        </Button>
                        <Button
                          onClick={() => toggleAddNewLesson(partId, index)}
                          size="small"
                          sx={{
                            color: '#6c68f3',
                            background: 'white',
                            border: '2px solid #6c68f3',
                            borderRadius: 1,
                            ml: 2,
                            fontSize: 12,
                            '&:hover': { background: '#fff' }
                          }}>
                          <Close sx={{ width: 14, height: 14 }} />
                        </Button>
                      </Box>
                    </ListItem>
                  )}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        {newPart && (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <TextField
              fullWidth
              required={true}
              error={!validNewPartName}
              value={newPartName}
              onChange={onChangeNewPartName}
              size="small"
              placeholder="Name"
              InputProps={{
                sx: {
                  borderRadius: 1
                }
              }}
            />
            <LoadingButton
              size="small"
              loading={submitting}
              onClick={submitAddNewPart}
              sx={{
                color: '#6c68f3',
                background: 'white',
                border: '2px solid #6c68f3',
                borderRadius: 1,
                ml: 2,
                '&:hover': { background: '#fff' }
              }}>
              <Check sx={{ width: 14, height: 14 }} />
            </LoadingButton>
            <Button
              onClick={toggleAddNewPart}
              size="small"
              sx={{
                color: '#6c68f3',
                background: 'white',
                border: '2px solid #6c68f3',
                borderRadius: 1,
                ml: 2,
                fontSize: 12,
                '&:hover': { background: '#fff' }
              }}>
              <Close sx={{ width: 14, height: 14 }} />
            </Button>
          </Box>
        )}
      </List>
      {editable && (
        <Button
          onClick={toggleAddNewPart}
          size="small"
          startIcon={<AddIcon />}
          sx={{
            color: '#6c68f3',
            background: 'white',
            border: '2px solid #6c68f3',
            borderRadius: 1,
            ml: 2,
            textTransform: 'none',
            '&:hover': { background: '#fff' }
          }}>
          {t('learningPath.newPart')}
        </Button>
      )}
    </React.Fragment>
  )
}

export default TableContent
