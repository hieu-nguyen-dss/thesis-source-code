import { FileIcon, defaultStyles } from 'react-file-icon'
import { Paper, IconButton, Box } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import { saveAs } from 'file-saver'
import { useLocation, useParams } from 'react-router-dom'

import { uploadApi } from '../../apis'
import vars from '../../config/vars'
import { useSnackbar } from '../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../constants'

const OtherTypeFile = (props) => {
  const { filename, type, handleDeleteOther, roadmapStepId } = props
  const ext = filename.split('.').pop()
  const { roadmapId } = useParams()
  const { openSnackbar } = useSnackbar()

  const download = () => {
    saveAs(`${vars.server}/resources/${roadmapId}/${roadmapStepId}/${filename}`, filename)
  }
  const submitDelete = async () => {
    try {
      const { status, data } = await uploadApi.deleteFileRoadmap(
        roadmapId,
        roadmapStepId,
        filename,
        type
      )
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Deleted')
        handleDeleteOther(filename)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }
  return (
    <Paper
      variant="outlined"
      sx={{ m: 1, width: 120, position: 'relative', p: 1, borderRadius: 0, ml: 0 }}>
      <Box style={{ width: 45 }}>
        <FileIcon extension={ext} {...defaultStyles[ext]} />
      </Box>
      <Box style={{ fontSize: 13, fontWeight: 500 }}>
        {filename.length <= 10 ? filename : `${filename.slice(0, 10)}...`}
      </Box>
      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
        <IconButton onClick={download} sx={{ width: 30, height: 30 }}>
          <DownloadIcon sx={{ width: 20, height: 20 }} />
        </IconButton>
        <IconButton onClick={submitDelete} sx={{ width: 30, height: 30 }}>
          <DeleteIcon sx={{ width: 20, height: 20 }} />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default OtherTypeFile
