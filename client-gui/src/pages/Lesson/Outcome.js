import * as React from 'react'
import {
  Box,
  IconButton,
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Popover,
  Tooltip,
  Button
} from '@mui/material'
import EditAttributesIcon from '@mui/icons-material/EditAttributes'
import GolfCourseIcon from '@mui/icons-material/GolfCourse'
import SaveIcon from '@mui/icons-material/Save'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { lessonApi } from '../../apis'

const KNOWLEDGE = 'knowledge'
const SKILL = 'skill'
const ATTITUDE = 'attitude'

const Outcome = (props) => {
  const { editable } = props
  const [mains, setMains] = React.useState({})
  const [subs, setSubs] = React.useState({})
  const [knowledges, setKnowledges] = React.useState({})
  const [skills, setSkills] = React.useState({})
  const [attitudes, setAttitudes] = React.useState({})
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [currentOutcome, setCurrentOutcome] = React.useState('')
  const [disabledSave, setDisabledSave] = React.useState(false)
  const { lesson: lessonId } = useParams()
  const { openSnackbar } = useSnackbar()
  const { t } = useTranslation('common')

  const submitSave = async () => {
    const changedData = JSON.stringify({ knowledges, skills, attitudes })
    try {
      const { status, data } = await lessonApi.updateLesson(lessonId, { outcomes: changedData })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Save done')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const onChangeCheckbox = (currentOutcome, id, value) => {
    if (currentOutcome === KNOWLEDGE) setKnowledges({ ...knowledges, [id]: value })
    if (currentOutcome === SKILL) setSkills({ ...skills, [id]: value })
    if (currentOutcome === ATTITUDE) setAttitudes({ ...attitudes, [id]: value })
  }

  const openEdit = (current, target) => {
    setCurrentOutcome(current)
    setAnchorEl(target)
  }
  React.useEffect(() => {
    const parsedOutcomes = JSON.parse(props.outcomes)
    if (parsedOutcomes.mains && parsedOutcomes.subs) {
      const mains = parsedOutcomes.mains.reduce(
        (res, cur) => ({
          ...res,
          [cur.mId]: { ...cur, childs: parsedOutcomes.subs.filter((sub) => sub.parent === cur.mId) }
        }),
        {}
      )
      const subs = parsedOutcomes.subs.reduce((res, cur) => ({ ...res, [cur.sId]: cur }), {})
      setMains(mains)
      setSubs(subs)
    }
  }, [props.outcomes])

  React.useEffect(() => {
    const parsedLO = JSON.parse(props.lessonOutcomes)
    setKnowledges(parsedLO.knowledges || {})
    setSkills(parsedLO.skills || {})
    setAttitudes(parsedLO.attitudes || {})
  }, [props.lessonOutcomes])
  return (
    <Grid item xs={4} sm={8} md={12}>
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
          <GolfCourseIcon />
          <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', ml: 1 }}>
            {t('lesson.outcomes')}
          </Typography>
        </Box>
        {editable && (
          <Button
            sx={{ textTransform: 'none' }}
            color="info"
            onClick={submitSave}
            endIcon={<SaveIcon />}>
              {t('lesson.save')}
          </Button>
        )}
        {/* <IconButton onClick={submitSave} color="info" disabled={disabledSave}>
          <SaveIcon />
        </IconButton> */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'stretch',
          width: '100%'
        }}>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', maxWidth: '33.3333%', m: 1, mx: 0 }}>
          <Box
            sx={{
              background: 'lightgreen',
              pl: 1,
              fontWeight: 'bold',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 46
            }}>
            {t('lesson.knowledge')}
            {editable && (
              <Tooltip title="Edit">
                <IconButton onClick={(e) => openEdit(KNOWLEDGE, e.currentTarget)}>
                  <EditAttributesIcon sx={{ width: 30, height: 30 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box>
            {Object.entries(subs).map(
              ([sId, sub], index) =>
                knowledges[sId] && (
                  <Box
                    key={index}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>{sub.id}</Typography>
                    <Typography sx={{ borderBottom: '1px solid #eee' }} key={index}>
                      {sub.value}
                    </Typography>
                  </Box>
                )
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', maxWidth: '33.33%', m: 1 }}>
          <Box
            sx={{
              background: 'lightblue',
              pl: 1,
              fontWeight: 'bold',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 46
            }}>
            {t('lesson.skill')}
            {editable && (
              <Tooltip title="Edit">
                <IconButton onClick={(e) => openEdit(SKILL, e.currentTarget)}>
                  <EditAttributesIcon sx={{ width: 30, height: 30 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box>
            {Object.entries(subs).map(
              ([sId, sub], index) =>
                skills[sId] && (
                  <Box
                    key={index}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>{sub.id}</Typography>
                    <Typography sx={{ borderBottom: '1px solid #eee' }} key={index}>
                      {sub.value}
                    </Typography>
                  </Box>
                )
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', maxWidth: '33.33%', m: 1, mx: 0 }}>
          <Box
            sx={{
              background: '#ee9090',
              fontWeight: 'bold',
              pl: 1,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 46
            }}>
            {t('lesson.attitude')}
            {editable && (
              <Tooltip title="Edit">
                <IconButton onClick={(e) => openEdit(ATTITUDE, e.currentTarget)}>
                  <EditAttributesIcon sx={{ width: 30, height: 30 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box>
            {Object.entries(subs).map(
              ([sId, sub], index) =>
                attitudes[sId] && (
                  <Box
                    key={index}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>{sub.id}</Typography>
                    <Typography sx={{ borderBottom: '1px solid #eee' }} key={index}>
                      {sub.value}
                    </Typography>
                  </Box>
                )
            )}
          </Box>
        </Box>
      </Box>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        style={{ padding: 2 }}>
        <FormGroup sx={{ m: 2 }}>
          {Object.entries(mains).map(([mId, main], index) => (
            <React.Fragment key={mId}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {main.id}. {main.value}
              </Typography>
              {main.childs.map((sub) => {
                let checklist = {}
                if (currentOutcome === KNOWLEDGE) checklist = knowledges
                if (currentOutcome === SKILL) checklist = skills
                if (currentOutcome === ATTITUDE) checklist = attitudes
                return (
                  <FormControlLabel
                    sx={{ ml: 1 }}
                    key={sub.sId}
                    control={
                      <Checkbox
                        checked={!!checklist[sub.sId]}
                        size="small"
                        onChange={(e) => onChangeCheckbox(currentOutcome, sub.sId, e.target.checked)}
                      />
                    }
                    label={`${sub.id}. ${sub.value}`}
                  />
                )
              })}
            </React.Fragment>
          ))}
        </FormGroup>
      </Popover>
    </Grid>
  )
}

export default Outcome
