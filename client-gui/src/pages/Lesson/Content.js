import * as React from 'react'
import { Typography, TextField, Box, Button, IconButton } from '@mui/material'
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { lessonApi } from '../../apis'

const Content = ({ content, editable }) => {
  const [contentIds, setContentIds] = React.useState([])
  const [contents, setContents] = React.useState({})
  const [disabledSave, setDisabledSave] = React.useState(true)
  const [newContent, setNewContent] = React.useState(false)
  const [newContentValue, setNewContentValue] = React.useState('')
  const { openSnackbar } = useSnackbar()
  const { lesson: lessonId } = useParams()
  const { t } = useTranslation('common')

  const onChangeContents = (id, value) => {
    setContents({ ...contents, [id]: value })
  }

  const addContent = () => {
    if (newContentValue === '') return
    setContents({ ...contents, [contentIds.length + 1]: newContentValue })
    setContentIds([...contentIds, contentIds.length + 1])
    setDisabledSave(false)
    setNewContent(false)
    setNewContentValue('')
  }

  const onBlur = () => {
    const changed = JSON.stringify({ contentIds, contents })
    setDisabledSave(content === changed)
  }

  const submitSave = async () => {
    try {
      const { status, data } = await lessonApi.updateLesson(lessonId, {
        content: JSON.stringify({ contentIds, contents })
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Save done')
        setDisabledSave(true)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const deleteContent = (index, id) => {
    const cpContentIds = [...contentIds]
    cpContentIds.splice(index, 1)
    setContentIds(cpContentIds)
    const cpContents = { ...contents }
    delete cpContents[id]
    setContents(cpContents)
    setDisabledSave(false)
  }

  React.useEffect(() => {
    const parsedContent = JSON.parse(content)
    if (parsedContent.contentIds && parsedContent.contents) {
      setContents(parsedContent.contents)
      setContentIds(parsedContent.contentIds)
    }
  }, [content])
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#efefef',
          minHeight: 36.5,
          pl: 1,
          borderRadius: 2
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <SourceOutlinedIcon />
          <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', ml: 1 }}>
            {t('lesson.content')}
          </Typography>
        </Box>
        {editable && <Button
          sx={{ textTransform: 'none' }}
          disabled={disabledSave}
          color="info"
          onClick={submitSave}
          endIcon={<SaveIcon />}>
          {t('lesson.save')}
        </Button>}
      </Box>
      {contentIds.map((contentId, index) =>
        editable
          ? (
            <Box
              className="content-box"
              key={index}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                mt: 2,
                alignItems: 'center',
                width: '100%'
              }}>
              <Box sx={{ minWidth: 30, fontWeight: 'bold' }}>{index + 1}.</Box>
              <TextField
                className="content-text"
                size="small"
                fullWidth
                value={contents[contentId]}
                onChange={(e) => onChangeContents(contentId, e.target.value)}
                multiline
                onBlur={onBlur}
              />
              <IconButton
                onClick={() => deleteContent(index, contentId)}
                className="content-del"
                size="small"
                sx={{
                  position: 'absolute',
                  right: 3,
                  top: 3,
                  borderRadius: 1,
                  width: 20,
                  height: 20
                }}>
                <CloseIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Box>
            )
          : (
            <Box
              className="content-box"
              key={index}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                mt: 2,
                mb: 2,
                alignItems: 'center',
                width: '100%'
              }}>
              <Box sx={{ minWidth: 30, fontWeight: 'bold' }}>{index + 1}.</Box>
              <Box>{contents[contentId]}</Box>
            </Box>
            )
      )}
      {newContent && (
        <>
          <Box
            key={contentIds.length + 1}
            sx={{ display: 'flex', flexDirection: 'row', mt: 2, alignItems: 'center' }}>
            <Box sx={{ minWidth: 30, fontWeight: 'bold' }}>{contentIds.length + 1}.</Box>
            <TextField
              size="small"
              value={newContentValue}
              onChange={(e) => setNewContentValue(e.target.value)}
              multiline
              fullWidth
              onBlur={onBlur}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              size="small"
              onClick={addContent}
              sx={{
                color: '#6c68f3',
                background: 'white',
                border: '2px solid #6c68f3',
                textTransform: 'none',
                mr: 1,
                '&:hover': {
                  background: 'white'
                }
              }}>
              OK
            </Button>
            <Button
              size="small"
              onClick={() => setNewContent(false)}
              sx={{
                color: '#6c68f3',
                background: 'white',
                border: '2px solid #6c68f3',
                textTransform: 'none',
                '&:hover': {
                  background: 'white'
                }
              }}>
              {t('lesson.cancel')}
            </Button>
          </Box>
        </>
      )}
      {editable && (
        <Button
          onClick={() => setNewContent(true)}
          startIcon={<AddIcon />}
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
          {t('lesson.newContent')}
        </Button>
      )}
    </Box>
  )
}
export default Content
