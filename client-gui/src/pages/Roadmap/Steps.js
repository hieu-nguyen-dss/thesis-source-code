import * as React from 'react'
import {
  Box,
  Button,
  Chip,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Radio,
  Card,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  IconButton,
  CardContent
} from '@mui/material'
import {
  Timeline,
  TimelineConnector,
  TimelineItem,
  TimelineSeparator,
  TimelineContent,
  TimelineDot
} from '@mui/lab'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LinearProgressWithLabel from '../../components/customs/LinearProgress'
import { roadmapApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { duration, remainingTime } from '../../utils/time'
import { useSnackbar } from '../../contexts'

const Steps = ({ steps, setSteps, setCurrentStep, currentStep, editable }) => {
  const [newStepName, setNewStepName] = React.useState('')
  const [newStepType, setNewStepType] = React.useState('Required')
  const [editStepName, setEditStepName] = React.useState('')
  const [editStepType, setEditStepType] = React.useState('Required')
  const [editStepId, setEditStepId] = React.useState('')
  const [openAddNew, setOpenAddNew] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const { openSnackbar } = useSnackbar()
  const { roadmapId } = useParams()
  const { t } = useTranslation('common')
  const L = Object.entries(steps).length

  const calCompletedPercent = (checklist) => {
    let total = 0
    let completed = 0
    Object.entries(checklist).forEach(([id, item]) => {
      total += 1
      if (item.completed) {
        completed += 1
      }
    })
    return Math.ceil((completed / total) * 100)
  }

  const submitCreateStep = async () => {
    if (!editable) return
    try {
      const { status, data } = await roadmapApi.createStep(roadmapId, {
        name: newStepName,
        type: newStepType
      })
      if (status === HTTP_STATUS.OK) {
        setSteps({ ...steps, [data._id]: data })
        setOpenAddNew(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openEditStep = (id) => {
    setEditStepName(steps[id].name)
    setEditStepType(steps[id].type)
    setEditStepId(id)
    setOpenEdit(true)
  }

  const updateStep = async () => {
    if (editStepName.length === 0) {
      openSnackbar(SNACKBAR.WARNING, 'Name must not be empty')
      return
    }
    try {
      const { status, data } = await roadmapApi.updateStep(roadmapId, editStepId, {
        name: editStepName,
        type: editStepType
      })
      if (status === HTTP_STATUS.OK) {
        setSteps({
          ...steps,
          [editStepId]: { ...steps[editStepId], name: editStepName, type: editStepType }
        })
      } else {
        openSnackbar(SNACKBAR.WARNING, 'Can not update')
      }
    } catch (error) {}
  }

  const selectStep = (stepId) => {
    setCurrentStep(stepId)
  }
  return (
    <Box>
      <Timeline sx={{ alignItems: 'flex-start', ml: -6 }}>
        {Object.entries(steps).map(([stepId, stepData], index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot sx={{ background: '#2fddb9' }} />
              {index < L - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Card
                variant="outlined"
                sx={{
                  width: 345,
                  borderRadius: 2,
                  border: currentStep === stepId ? '2px solid #6c68f3' : '2px solid white'
                }}>
                <CardContent sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="small"
                      sx={{
                        textTransform: 'none',
                        color: 'black',
                        fontSize: 14,
                        flexGrow: 1,
                        '&.MuiButton-root': { justifyContent: 'flex-start' }
                      }}
                      onClick={() => selectStep(stepId)}>
                      <Typography sx={{ fontWeight: 500 }}>{stepData.name}</Typography>
                    </Button>
                    {editable && (
                      <IconButton onClick={() => openEditStep(stepId)} size="small">
                        <EditRoundedIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 13, color: 'lightslategrey' }}>
                    {stepData.finishDate && stepData.startDate
                      ? `${duration(stepData.startDate, stepData.finishDate)} ${t('roadmap.days')}`
                      : ''}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#6c68f3' }}>
                    {stepData.finishDate
                      ? `${remainingTime(stepData.finishDate, t)} ${t('roadmap.left')}`
                      : '∞'}
                  </Typography>
                  <Box sx={{ textAlign: 'right', mb: 1 }}>
                    {stepData.type === 'Required' && (
                      <Chip
                        variant="outlined"
                        size="small"
                        label={t(`roadmap.${stepData.type.toLowerCase()}`)}
                        sx={{
                          fontSize: 13,
                          color: 'grey',
                          background: '#ffd400',
                          border: '2px solid #ffe500'
                        }}
                      />
                    )}
                    {stepData.type === 'Optional' && (
                      <Chip
                        size="small"
                        label={t(`roadmap.${stepData.type.toLowerCase()}`)}
                        sx={{ fontSize: 13 }}
                      />
                    )}
                  </Box>
                  <LinearProgressWithLabel
                    value={stepData.checklist ? calCompletedPercent(stepData.checklist) : 0}
                  />
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      {editable && (
        <Button
          startIcon={<FiberManualRecordIcon />}
          onClick={() => setOpenAddNew(true)}
          size="small"
          sx={{
            color: '#6c68f3',
            background: 'white',
            ml: 3.5,
            border: '2px solid #6c68f3',
            textTransform: 'none',
            '&:hover': {
              background: 'white'
            }
          }}>
          {t('roadmap.newStep')}
        </Button>
      )}
      <Dialog open={openAddNew} onClose={() => setOpenAddNew(false)}>
        <DialogTitle>{t('roadmap.newStep')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            placeholder={t('roadmap.stepName')}
            sx={{ mb: 2 }}
            size="small"
            value={newStepName}
            onChange={(e) => setNewStepName(e.target.value)}
          />
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">{t('roadmap.required')}</FormLabel>
            <RadioGroup
              value={newStepType}
              onChange={(e) => setNewStepType(e.target.value)}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group">
              <FormControlLabel
                value="Required"
                control={<Radio />}
                label={t('roadmap.required')}
              />
              <FormControlLabel
                value="Optional"
                control={<Radio />}
                label={t('roadmap.optional')}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={submitCreateStep}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              ml: 5,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('roadmap.create')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>{t('roadmap.editStep')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            placeholder={t('roadmap.stepName')}
            sx={{ mb: 2 }}
            size="small"
            value={editStepName}
            onChange={(e) => setEditStepName(e.target.value)}
          />
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">{t('roadmap.required')}</FormLabel>
            <RadioGroup
              value={editStepType}
              onChange={(e) => setEditStepType(e.target.value)}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group">
              <FormControlLabel
                value="Required"
                control={<Radio />}
                label={t('roadmap.required')}
              />
              <FormControlLabel
                value="Optional"
                control={<Radio />}
                label={t('roadmap.optional')}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={updateStep}
            size="small"
            sx={{
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none',
              ml: 5,
              '&:hover': {
                background: 'white'
              }
            }}>
            {t('roadmap.update')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
export default Steps
