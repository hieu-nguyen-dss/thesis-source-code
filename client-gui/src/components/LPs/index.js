import * as React from 'react'
import {
  Box,
  Grid,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Tab
} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import AddIcon from '@mui/icons-material/Add'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { styled } from '@mui/material/styles'
import { Outlet, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LP from './LP'
import Roadmap from './Roadmap'
import Filter from './Filter'
import categoryIcons from './categoryIcons'
import { ACTOR_TYPE, HTTP_STATUS, CATEGORY, SNACKBAR } from '../../constants'
import { lpApi, ogzApi, roadmapApi } from '../../apis'
import { useSnackbar, useAuth } from '../../contexts'
import { isMatch } from '../../utils/filterLP'

const CustomDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '10px',
    border: 'none',
    minWidth: 900
  }
}))

const LP_TYPE = {
  ROADMAP: 'ROADMAP',
  COURSE: 'COURSE',
  SUBJECT: 'SUBJECT'
}

const MyLPs = (props) => {
  const [LPs, setLPs] = React.useState(props.lps)
  const [roadmaps, setRoadmaps] = React.useState([])
  const [filterLPs, setFilterLPs] = React.useState(props.lps)
  const [filterRoadmap, setFilterRoadmap] = React.useState([])
  const [openCreateNew, setOpenCreateNew] = React.useState(false)
  const [newName, setNewName] = React.useState('')
  const [newCategory, setNewCategory] = React.useState('math')
  const [newDescription, setNewDescription] = React.useState('')
  const [countCate, setCountCate] = React.useState({})
  const [currentTab, setCurrentTab] = React.useState('0')
  const { t } = useTranslation('common')
  const { pathname } = useLocation()
  const { ogzId } = useParams()
  const { openSnackbar } = useSnackbar()
  const auth = useAuth()
  const ogzMode = pathname.includes('organizations')
  const [newLPType, setNewLPType] = React.useState(ogzMode ? LP_TYPE.COURSE : LP_TYPE.ROADMAP)

  const submitCreateOgzCourse = async () => {
    try {
      const { status, data } = await ogzApi.createLp(ogzId, {
        name: newName,
        category: newCategory,
        description: newDescription,
        ownerType: ACTOR_TYPE.ORGANIZATION
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Create successfully')
        setLPs([...LPs, data[0]])
        setFilterLPs([...LPs, data[0]])
        countByCate([...LPs, data[0]])
        setOpenCreateNew(false)
      } else {
        openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const submitCreateCourse = async () => {
    try {
      const { status, data } = await lpApi.createLP({
        name: newName,
        category: newCategory,
        description: newDescription,
        ownerType: ACTOR_TYPE.TEACHER
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Create successfully')
        const newCourseList = [...LPs, data]
        setFilterLPs(newCourseList)
        countByCate([...newCourseList, roadmaps])
        setLPs(newCourseList)
        setOpenCreateNew(false)
      } else {
        openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const submitCreateRoadmap = async () => {
    try {
      const { status, data } = await roadmapApi.createRoadmap({
        name: newName,
        category: newCategory,
        description: newDescription
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Create successfully')
        const newRmList = [...roadmaps, data]
        setFilterRoadmap(newRmList)
        countByCate([...newRmList, LPs])
        setRoadmaps(newRmList)
        setOpenCreateNew(false)
      } else {
        openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }
  const submitCreateNew = async () => {
    if (newName === '' || newDescription === '') {
      openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
      return
    }
    if (ogzMode) {
      await submitCreateOgzCourse()
    } else if (newLPType === LP_TYPE.SUBJECT) {
      await submitCreateCourse()
    } else if (newLPType === LP_TYPE.ROADMAP) {
      await submitCreateRoadmap()
    }
  }

  const filter = (str = '', category = '') => {
    const crs = LPs.filter((LP) => {
      if (category === '') {
        return isMatch(LP.name, str) && isMatch(LP.category, category)
      } else {
        return isMatch(LP.name, str) && category === LP.category
      }
    })
    const rms = roadmaps.filter((rm) => {
      if (category === '') {
        return isMatch(rm.name, str) && isMatch(rm.category, category)
      } else {
        return isMatch(rm.name, str) && category === rm.category
      }
    })
    setFilterRoadmap(rms)
    setFilterLPs(crs)
  }

  const getLPs = async () => {
    if (ogzMode) {
      return
    }
    const { status, data } = await lpApi.getMyLPs()

    if (status === HTTP_STATUS.OK) {
      setLPs(data.courses)
      setFilterLPs(data.courses)
      setFilterRoadmap(data.roadmaps)
      setRoadmaps(data.roadmaps)
      countByCate([...data.courses, ...data.roadmaps])
    }
  }

  const countByCate = (LPs) => {
    const rs = LPs.reduce(
      (res, cur) => ({ ...res, [cur.category]: (res[cur.category] || 0) + 1 }),
      {}
    )
    setCountCate(rs)
  }

  React.useEffect(() => {
    getLPs()
  }, [])

  React.useEffect(() => {
    if (props.lps) {
      setLPs(props.lps)
      setFilterLPs(props.lps)
      countByCate(props.lps)
    }
  }, [props.lps])

  return (
    <Box sx={{ background: 'white', borderRadius: 3, p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MenuBookIcon />
        <Typography
          sx={{ ml: 1, color: (theme) => theme.palette.primary.main, fontWeight: 'bold' }}>
          {t('learningPath.learningPath')}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          pt: ogzMode ? 0 : 2
        }}>
        <Filter filter={filter} countCate={countCate} />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            px: 1,
            height: 'calc(100vh - 90px)',
            overflowY: 'scroll'
          }}>
          <TabContext value={currentTab}>
            <TabList onChange={(_e, v) => setCurrentTab(v)}>
              <Tab value="0" label={t('learningPath.tabCourse')} />
              {!ogzMode && <Tab value="1" label={t('learningPath.tabRoadmap')} />}
            </TabList>
            <TabPanel value="0">
              <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 1, sm: 3, md: 12 }}>
                {filterLPs &&
                  filterLPs.map((lp, index) => (
                    <Grid item xs={1} sm={1} md={3} key={index}>
                      <LP data={lp} icon={categoryIcons[lp.category]} />
                    </Grid>
                  ))}
                {((ogzMode && props.youAreAdmin) || !ogzMode) && (
                  <Grid item xs={1} sm={1} md={3}>
                    <Button
                      onClick={() => setOpenCreateNew(true)}
                      sx={{
                        color: '#6c68f3',
                        background: 'white',
                        border: 'dashed 2px #6c68f3',
                        borderRadius: 0,
                        m: 2,
                        mt: 0,
                        width: 50,
                        height: 50,
                        flexGrow: 1
                      }}>
                      <AddIcon />
                    </Button>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
            <TabPanel value="1">
              <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 1, sm: 3, md: 12 }}>
                {filterRoadmap &&
                  filterRoadmap.map((roadmap, index) => (
                    <Grid item xs={1} sm={1} md={3} key={index}>
                      <Roadmap data={roadmap} icon={categoryIcons[roadmap.category]} />
                    </Grid>
                  ))}
                {((ogzMode && props.youAreAdmin) || !ogzMode) && (
                  <Grid item xs={1} sm={1} md={3}>
                    <Button
                      onClick={() => setOpenCreateNew(true)}
                      sx={{
                        color: '#6c68f3',
                        background: 'white',
                        border: 'dashed 2px #6c68f3',
                        borderRadius: 0,
                        m: 2,
                        mt: 0,
                        width: 50,
                        height: 50,
                        flexGrow: 1
                      }}>
                      <AddIcon />
                    </Button>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
        <CustomDialog open={openCreateNew} onClose={() => setOpenCreateNew(false)}>
          <DialogTitle>{t('learningPath.newLp.dialogTitle')}</DialogTitle>
          <DialogContent>
            <DialogContent>
              <TextField
                size="small"
                required
                fullWidth
                label={t('learningPath.newLp.namePlaceholder')}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                sx={{ mb: 2, mt: 2 }}
              />
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">{t('learningPath.newLp.category')}</InputLabel>
                <Select
                  required
                  labelId="demo-select-small"
                  id="demo-select-small"
                  fullWidth
                  value={newCategory}
                  label={t('learningPath.newLp.category')}
                  onChange={(e) => setNewCategory(e.target.value)}>
                  {Object.entries(CATEGORY).map(([category, { code, name }], index) => (
                    <MenuItem key={index} value={code}>
                      {t(`categories.${code}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200, ml: 2 }}>
                <InputLabel id="demo-select-type">{t('learningPath.newLp.lpType')}</InputLabel>
                <Select
                  required
                  labelId="demo-select-type"
                  id="demo-select-type"
                  fullWidth
                  value={newLPType}
                  label={t('learningPath.newLp.lpType')}
                  onChange={(e) => setNewLPType(e.target.value)}>
                  {!ogzMode && (
                    <MenuItem value={LP_TYPE.ROADMAP}>{t('learningPath.newLp.roadmap')}</MenuItem>
                  )}
                  {!ogzMode && (
                    <MenuItem value={LP_TYPE.SUBJECT}>{t('learningPath.newLp.course')}</MenuItem>
                  )}
                  {ogzMode && (
                    <MenuItem value={LP_TYPE.COURSE}>{t('learningPath.newLp.forOgz')}</MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                size="small"
                fullWidth
                required
                label={t('learningPath.newLp.description')}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                sx={{ mb: 2, mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                size="small"
                sx={{
                  textTransform: 'none',
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  '&:hover': { background: '#fff' }
                }}
                onClick={() => setOpenCreateNew(false)}>
                {t('learningPath.newLp.cancel')}
              </Button>
              <Button
                onClick={submitCreateNew}
                autoFocus
                size="small"
                sx={{
                  textTransform: 'none',
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  '&:hover': { background: '#fff' }
                }}>
                {t('learningPath.newLp.ok')}
              </Button>
            </DialogActions>
          </DialogContent>
        </CustomDialog>
      </Box>
      {/* <Outlet /> */}
    </Box>
  )
}
export default MyLPs
