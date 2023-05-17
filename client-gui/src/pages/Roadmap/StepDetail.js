import * as React from 'react'
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AddLinkIcon from '@mui/icons-material/AddLink'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import { nanoid } from 'nanoid'
import { useParams } from 'react-router-dom'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'

import OtherTypeFile from './OtherTypeFile'
import LinearProgressWithLabel from '../../components/customs/LinearProgress'
import { roadmapApi, uploadApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'
import vars from '../../config/vars'
import { set } from 'date-fns'

const Input = styled('input')({
  display: 'none'
})

const StepDetail = (props) => {
  const { data, changeStepData, editable, ownerId } = props
  const [startDate, setStartDate] = React.useState(
    data.startDate ? new Date(data.startDate) : new Date()
  )
  const [finishDate, setFinishDate] = React.useState(
    data.finishDate ? new Date(data.finishDate) : new Date()
  )
  const [reminderBefore, setReminderBefore] = React.useState(data.reminderBefore || 5)
  const [checklist, setChecklist] = React.useState(data.checklist || {})
  const [openAddCheckList, setOpenAddCheckList] = React.useState(false)
  const [newCheckListItem, setNewCheckListItem] = React.useState('')
  const [referenceLinks, setReferenceLinks] = React.useState(data.referenceLinks || [])
  const [openAddReference, setOpenAddReference] = React.useState(false)
  const [newRefLink, setNewRefLink] = React.useState('')
  const [newRefName, setNewRefName] = React.useState('')
  const [selectedFiles, setSelectedFiles] = React.useState([])
  const [files, setFiles] = React.useState(data.resources || [])
  const [fileGroupByType, setFileGroupByType] = React.useState({})
  const [description, setDescription] = React.useState(data.description || '')
  const { roadmapId } = useParams()
  const { t } = useTranslation('common')

  React.useEffect(() => {
    setChecklist(data.checklist || {})
    setStartDate(data.startDate ? new Date(data.startDate) : new Date())
    setFinishDate(data.finishDate ? new Date(data.finishDate) : new Date())
    setReferenceLinks(data.referenceLinks || [])
    setFiles(data.resources || [])
    setDescription(data.description || '')
    setReminderBefore(data.reminderBefore || 5)
  }, [data])
  const calCompletedPercent = React.useCallback(() => {
    let total = 0
    let completed = 0
    Object.entries(checklist).forEach(([id, item]) => {
      total += 1
      if (item.completed) {
        completed += 1
      }
    })
    if (total === 0) return 0
    return Math.ceil((completed / total) * 100)
  }, [checklist])

  const handleKeyUpNewRefLink = (e) => {
    if (!editable) return
    if (e.key === 'Enter' && newRefName !== '') {
      const updatedReferenceLinks = [...referenceLinks, { name: newRefName, link: newRefLink }]
      setReferenceLinks(updatedReferenceLinks)
      setNewRefLink('')
      setNewRefName('')
      changeStepData({ referenceLinks: updatedReferenceLinks })
      submitChange({ referenceLinks: updatedReferenceLinks })
        .then()
        .catch((error) => console.log(error))
    }
  }

  const handleKeyUpNewCheckList = (e) => {
    if (!editable) return
    if (e.key === 'Enter' && newCheckListItem !== '') {
      const newItem = { [nanoid(10)]: { name: newCheckListItem, completed: false } }
      const updatedChecklist = {
        ...checklist,
        ...newItem
      }
      setChecklist(updatedChecklist)
      changeStepData({ checklist: updatedChecklist })
      setNewCheckListItem('')
      submitChange({
        checklist: updatedChecklist,
        updateChecklistType: 'ADD',
        content: { stepName: data.name, itemName: newCheckListItem, stepId: data._id },
        ownerId
      })
        .then(({ status, data }) => console.log(status))
        .catch((error) => console.log(error))
    }
  }

  const onChangeChecklist = (checkboxId, value) => {
    if (!editable) return
    const updatedChecklist = {
      ...checklist,
      [checkboxId]: {
        ...checklist[checkboxId],
        completed: value,
        completedAt: value ? new Date() : 'NODATE'
      }
    }
    setChecklist(updatedChecklist)
    changeStepData({ checklist: updatedChecklist })
    submitChange({
      checklist: updatedChecklist,
      updateChecklistType: value ? 'DONE' : 'UNCHECK',
      content: { itemName: checklist[checkboxId].name, stepName: data.name, stepId: data._id },
      ownerId
    })
      .then(({ status, data }) => console.log(status))
      .catch((error) => console.log(error))
  }
  const submitChange = async (changeData) => {
    try {
      return await roadmapApi.updateStep(roadmapId, data._id, changeData)
    } catch (error) {}
  }

  const submitChangeStartDate = (value) => {
    setStartDate(value)
    changeStepData({ startDate: value })
    submitChange({ startDate: value })
      .then()
      .catch((error) => console.log(error))
  }

  const submitChangeFinishDate = (value) => {
    setFinishDate(value)
    changeStepData({ finishDate: value })
    submitChange({ finishDate: value })
      .then()
      .catch((error) => console.log(error))
  }

  const handleSelect = (e) => {
    const files = Object.entries(e.target.files).map(([id, file]) => file)
    setSelectedFiles(files)
  }

  const groupFileByType = (files) => {
    const rs = files.reduce((res, cur) => {
      if (cur.type.includes('image')) {
        return { ...res, imgs: [...(res.imgs || []), cur] }
      } else {
        return { ...res, others: [...(res.others || []), cur] }
      }
    }, {})
    setFileGroupByType(rs)
  }

  const handleUploadFile = async () => {
    try {
      const form = new FormData()
      let names = []
      for (const index in selectedFiles) {
        form.append('resource-' + index, selectedFiles[index])
        names = [...names, selectedFiles[index].name]
      }
      const { status, data } = await uploadApi.uploadFileRoadmap(roadmapId, props.data._id, form)
      if (status === HTTP_STATUS.OK) {
        setFiles([...files, ...data])
        changeStepData({ resources: [...files, ...data] })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (name, type) => {
    try {
      const { status, data } = await uploadApi.deleteFileRoadmap(
        roadmapId,
        props.data._id,
        name,
        type
      )
      if (status === HTTP_STATUS.OK) {
        const after = files.filter((file) => file.name !== name)
        setFiles(after)
        changeStepData({ resources: after })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteOther = (name) => {
    const after = files.filter((file) => file.name !== name)
    setFiles(after)
    changeStepData({ resources: after })
  }

  const download = (filename) => {
    saveAs(`${vars.server}/resources/${roadmapId}/${data._id}/${filename}`, filename)
  }

  const submitChangeDescription = () => {
    if (description === '') return
    changeStepData({ description })
    submitChange({ description })
      .then()
      .catch((err) => console.log(err))
  }

  const submitChangeReminderBefore = () => {
    if (reminderBefore < 1) {
      setReminderBefore(1)
      return
    }
    changeStepData({ reminderBefore })
    submitChange({ reminderBefore }).then().catch()
  }

  React.useEffect(() => {
    groupFileByType(files)
  }, [files])

  return (
    <React.Fragment>
      <Typography
        sx={{
          fontWeight: 500,
          textAlign: 'center',
          fontSize: 18,
          mb: 3,
          color: (theme) => theme.palette.primary.main
        }}>
        {data.name}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessAlarmIcon />
            <Typography sx={{ ml: 1, fontWeight: 500 }}>{t('roadmap.time')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                value={startDate}
                inputFormat="dd MMM yyyy"
                onChange={submitChangeStartDate}
                disabled={!editable}
                renderInput={(params) => (
                  <TextField
                    InputProps={{ sx: { fontSize: 14, height: 40 } }}
                    {...params}
                    label={t('roadmap.startDate')}
                    size="small"
                  />
                )}
              />

              <DoubleArrowIcon />
              <DesktopDatePicker
                value={finishDate}
                disabled={!editable}
                inputFormat="dd MMM yyyy"
                onChange={submitChangeFinishDate}
                renderInput={(params) => (
                  <TextField
                    InputProps={{ sx: { fontSize: 14, height: 40 } }}
                    {...params}
                    label={t('roadmap.finishDate')}
                    size="small"
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
          <NotificationsActiveIcon />
          <Typography sx={{ ml: 1, fontWeight: 500 }}>{t('roadmap.remindBefore')}</Typography>
        </Box>
        <TextField
          value={reminderBefore}
          onChange={(e) => setReminderBefore(e.target.value)}
          onBlur={submitChangeReminderBefore}
          sx={{ ml: 4 }}
          type={'number'}
          size="small"
          label={t('roadmap.days')}
        />
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
          <FactCheckIcon />
          <Typography sx={{ ml: 1, fontWeight: 500 }}>{t('roadmap.checklist')}</Typography>
        </Box>
        <Box sx={{ ml: 4 }}>
          <LinearProgressWithLabel value={calCompletedPercent()} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
          {Object.entries(checklist).map(([id, item], index) => (
            <FormControlLabel
              key={index}
              label={
                <Box sx={{ color: 'black' }}>
                  {item.name}
                  {checklist[id].completed && (
                    <Typography sx={{ fontSize: 12, color: 'lightslategrey' }}>
                      {`${t('roadmap.completedAt')} ${new Date(item.completedAt).toLocaleTimeString(
                        'vi-VN'
                      )} ${new Date(item.completedAt).toLocaleDateString('vi-VN')}`}
                    </Typography>
                  )}
                </Box>
              }
              sx={{ mt: 0.2 }}
              control={
                <Checkbox
                  disabled={!editable}
                  checked={checklist[id].completed}
                  onChange={(e) => onChangeChecklist(id, e.target.checked)}
                  checkedIcon={<CheckCircleIcon sx={{ color: '#03b503' }} />}
                  icon={<RadioButtonUncheckedIcon />}
                />
              }
            />
          ))}
        </Box>
        {openAddCheckList && (
          <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
            <TextField
              size="small"
              fullWidth
              multiline
              placeholder={t('roadmap.newItemName')}
              value={newCheckListItem}
              onChange={(e) => setNewCheckListItem(e.target.value)}
              onKeyUp={handleKeyUpNewCheckList}
            />
          </Box>
        )}
        {editable && (
          <Button
            onClick={() => setOpenAddCheckList(true)}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              '&:hover': {
                background: 'white'
              },
              ml: 4,
              mt: 2
            }}
            startIcon={<CheckCircleIcon />}>
            {t('roadmap.newItem')}
          </Button>
        )}
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
          <AttachFileIcon />
          <Typography sx={{ ml: 1, fontWeight: 500 }}>{t('roadmap.resources')}</Typography>
        </Box>
        <Box sx={{ ml: 4 }}>
          {fileGroupByType.imgs && (
            <ImageList sx={{ width: '100%' }} cols={5} children>
              {fileGroupByType.imgs.map((file, index) => (
                <ImageListItem key={index} sx={{ border: '0.5px solid lightgrey' }}>
                  <img
                    src={`${vars.server}/resources/${roadmapId}/${data._id}/${file.name}?w=164&h=164&fit=crop&auto=format`}
                    alt={file.name}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    sx={{ fontSize: 13 }}
                    subtitle={file.name}
                    actionIcon={
                      <Box sx={{ display: 'flex' }}>
                        <IconButton
                          onClick={() => download(file.name)}
                          sx={{ width: 30, height: 30, color: 'white' }}>
                          <DownloadIcon sx={{ width: 20, height: 20 }} />
                        </IconButton>
                        {editable && (
                          <IconButton
                            onClick={() => handleDelete(file.name, file.type)}
                            sx={{ width: 30, height: 30, color: 'white' }}>
                            <DeleteIcon sx={{ width: 20, height: 20 }} />
                          </IconButton>
                        )}
                      </Box>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          <Box sx={{ display: 'flex' }}>
            {fileGroupByType.others &&
              fileGroupByType.others.map((file, index) => (
                <OtherTypeFile
                  key={index}
                  filename={file.name}
                  type={file.type}
                  handleDeleteOther={handleDeleteOther}
                  roadmapStepId={data._id}
                />
              ))}
          </Box>
          {editable && (
            <label htmlFor="contained-button-file">
              <Input
                id="contained-button-file"
                multiple
                type="file"
                name="resource"
                onChange={handleSelect}
              />
              <Button
                size="small"
                sx={{
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'white'
                  }
                }}
                component="span"
                endIcon={<AddLinkIcon />}>
                {t('roadmap.chooseFile')}
              </Button>
            </label>
          )}
          {editable && (
            <Button
              onClick={handleUploadFile}
              size="small"
              sx={{
                color: '#6c68f3',
                background: 'white',
                border: '2px solid #6c68f3',
                textTransform: 'none',
                ml: 2,
                '&:hover': {
                  background: 'white'
                }
              }}
              endIcon={<FileUploadIcon />}>
              {t('roadmap.upload')}
            </Button>
          )}
        </Box>
        <Box sx={{ ml: 4, mt: 2 }}>
          <Box>
            {referenceLinks.map((referenceLink, index) => (
              <Box sx={{ display: 'flex' }} key={index}>
                <Box sx={{ width: 100, mr: 1, fontWeight: 500 }}>{referenceLink.name}</Box>
                <a href={referenceLink.link} style={{ marginLeft: 5 }} target="_blank">
                  {referenceLink.link}
                </a>
              </Box>
            ))}
          </Box>
          {openAddReference && (
            <Box sx={{ display: 'flex' }}>
              <TextField
                placeholder="Name"
                value={newRefName}
                onChange={(e) => setNewRefName(e.target.value)}
                InputProps={{ sx: { width: 100, background: 'white' } }}
                size="small"
              />
              <TextField
                sx={{ background: 'white', mb: 1, ml: 3 }}
                type="url"
                fullWidth
                size="small"
                value={newRefLink}
                onChange={(e) => setNewRefLink(e.target.value)}
                onKeyUp={handleKeyUpNewRefLink}
                placeholder="URL"
              />
            </Box>
          )}
          {editable && (
            <Button
              onClick={() => setOpenAddReference(true)}
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
              {t('roadmap.addLink')}
            </Button>
          )}
        </Box>
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
          <DescriptionIcon />
          <Typography sx={{ ml: 1, fontWeight: 500 }}>{t('roadmap.description')}</Typography>
        </Box>
        <Box sx={{ ml: 4 }}>
          {editable && (
            <TextField
              onBlur={submitChangeDescription}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('roadmap.description')}
              fullWidth
              multiline
              value={description}
              sx={{ background: 'white' }}
            />
          )}
          {!editable && (
            <Box sx={{ background: 'white', p: 1, border: '1px solid lightgrey' }}>
              {description}
            </Box>
          )}
        </Box>
      </Box>
    </React.Fragment>
  )
}
export default StepDetail
