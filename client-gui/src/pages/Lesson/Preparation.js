import * as React from 'react'
import { Typography, TextField, Box, Button } from '@mui/material'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import SaveIcon from '@mui/icons-material/Save'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { lessonApi } from '../../apis'

const Preparation = ({ preparation, editable }) => {
  const [v, setV] = React.useState(preparation)
  const { t } = useTranslation('common')
  const { openSnackbar } = useSnackbar()
  const { lesson: lessonId } = useParams()
  const submitSave = async () => {
    try {
      const { status, data } = await lessonApi.updateLesson(lessonId, {
        preparation: v
      })
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Save done')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  React.useEffect(() => {
    setV(preparation)
  }, [preparation])

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
          mb: 2,
          borderRadius: 2
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ArchitectureIcon />
          <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            {t('lesson.preparation')}
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
      </Box>
      {editable && <TextField
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder= {t('lesson.preparationPlaceholder')}
        multiline
        fullWidth
      />
      }
      {!editable && <Box sx={{ m: 2 }} >{v}</Box>}
    </Box>
  )
}
export default Preparation
