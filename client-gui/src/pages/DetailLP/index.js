import * as React from 'react'
import { Grid, Paper, Box, Button } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ShareIcon from '@mui/icons-material/Share'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Description from './Description'
import TableContent from './TableContent'
import Outcomes from './Outcomes'
import Rubric from './Rubric'
import MainInfo from './MainInfo'
import Name from './Name'
import Setting from './Setting'
import Comment from '../../components/Comment'

import { lpApi } from '../../apis'
import { useSnackbar, useDocumentTitle, useBreadcrumb } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import notFoundBg from '../../assets/flaticon/404.png'

const DetailLP = (props) => {
  const [detail, setDetail] = React.useState(null)
  const [settingData, setSettingData] = React.useState(null)
  const params = useParams()
  const { pathname } = useLocation()
  const { openSnackbar } = useSnackbar()
  const { setTitle } = useDocumentTitle()
  const settingRef = React.useRef()
  const { handleAddBreadcrumb } = useBreadcrumb()
  const [notFound, setNotFound] = React.useState(false)
  const { t } = useTranslation('common')
  const ogzMode = pathname.includes('organizations')

  const getLPDetail = async () => {
    let get
    if (ogzMode) {
      get = lpApi.getOgzLPDetail(params.id, params.ogzId)
    } else {
      get = lpApi.getLPDetail(params.id)
    }
    const { status, data } = await get
    if (status === HTTP_STATUS.OK) {
      if (!data) return
      handleAddBreadcrumb(pathname, `Course ${data.name}`)
      setSettingData({
        owner: data.ownerId,
        isPublic: data.public,
        allowClone: data.allowClone || true
      })
      setDetail(data)
      setTitle(`${document.title} | Course ${data.name}`)
    }
    if (status === HTTP_STATUS.NOT_FOUND) {
      setNotFound(true)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    openSnackbar(SNACKBAR.INFO, 'Copied share link to clipboard')
  }

  const handleOpenSetting = () => {
    if (settingRef.current) {
      settingRef.current.openSetting()
    }
  }

  const submitCloneLp = async () => {
    try {
      const { status, data } = await lpApi.cloneLp(params.id)
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Clone successfully, Check in Learning path menu')
        console.log(data)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }

  const handleExport = async () => {
    try {
      lpApi.exportLP(params.id, detail.name)
    } catch (error) {}
  }

  React.useEffect(() => {
    getLPDetail()
  }, [])

  return (
    <React.Fragment>
      {detail && (
        <Box
          sx={{
            background: 'white',
            p: 2,
            mt: 2,
            borderRadius: 3,
            minHeight: 'calc(100vh - 140px)'
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 5 }}>
            <Name editable={detail ? detail.yours : false} name={detail ? detail.name : ''} />
            <Box>
              <Button
                onClick={handleExport}
                size="small"
                sx={{
                  mr: 1,
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none'
                }}
                endIcon={<ExitToAppOutlinedIcon />}>
                {t('learningPath.export')}
              </Button>
              <Button
                onClick={handleShare}
                size="small"
                sx={{
                  mr: 1,
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none'
                }}
                endIcon={<ShareIcon />}>
                {t('learningPath.share')}
              </Button>
              <Button
                onClick={submitCloneLp}
                disabled={!detail.allowClone && Boolean(!detail.yours)}
                size="small"
                sx={{
                  mr: 1,
                  color: '#6c68f3',
                  background: 'white',
                  textTransform: 'none',
                  border:
                    !detail.allowClone && Boolean(!detail.yours)
                      ? '2px solid lightgrey'
                      : '2px solid #6c68f3',
                  '&:hover': { background: '#fff' }
                }}
                endIcon={<ContentCopyIcon />}>
                {t('learningPath.clone')}
              </Button>
              {detail && (
                <Button
                  onClick={handleOpenSetting}
                  disabled={Boolean(!detail.yours)}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#6c68f3',
                    background: 'white',
                    border: !detail.yours ? '2px solid lightgrey' : '2px solid #6c68f3',
                    '&:hover': { background: '#fff' }
                  }}
                  endIcon={<SettingsIcon />}>
                  {t('learningPath.setting')}
                </Button>
              )}
            </Box>
          </Box>
          {settingData && <Setting ref={settingRef} data={settingData} />}
          <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={4} sm={8} md={4}>
              <Paper
                variant="outlined"
                sx={{ width: '100%', height: '100%', borderRadius: 3, border: 'none' }}>
                <MainInfo data={detail} />
              </Paper>
            </Grid>
            <Grid item xs={4} sm={8} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Description data={detail ? detail.description : ''} />
                <Outcomes outcomes={detail ? detail.outcomes : '{}'} />
                <Rubric rubrics={detail.rubrics || {}} />
              </Box>
              <Paper variant="outlined" sx={{ m: 2, mb: 0, p: 2, borderRadius: 3, border: 'none' }}>
                {detail && detail.parts && (
                  <TableContent
                    allParts={detail.parts}
                    editable={detail.yours || detail.editable}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
          <Comment
            commentIds={detail.comments || []}
            type="course"
            ownerId={detail.ownerId ? detail.ownerId._id : ''}
          />
        </Box>
      )}
      {!detail && (
        <Box
          sx={{
            background: 'white',
            p: 2,
            mt: 2,
            borderRadius: 3,
            minHeight: 'calc(100vh - 140px)',
            backgroundImage: notFound ? `url(${notFoundBg})` : 'none',
            backgroundSize: 'cover 5%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}>
        </Box>
      )}
    </React.Fragment>
  )
}
export default DetailLP
