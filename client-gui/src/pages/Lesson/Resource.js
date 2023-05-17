import * as React from 'react'
import {
  Box,
  Typography,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AttachmentIcon from '@mui/icons-material/Attachment'
import AddLinkIcon from '@mui/icons-material/AddLink'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import { saveAs } from 'file-saver'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import FileIm from './FileIcons'
import { uploadApi } from '../../apis'
import vars from '../../config/vars'
import { HTTP_STATUS } from '../../constants'

const Input = styled('input')({
  display: 'none'
})

ImageList.propTypes = {}

const Resource = ({ resources, setResources, editable }) => {
  const [selectedFiles, setSelectedFiles] = React.useState([])
  const [files, setFiles] = React.useState([])
  const [currentFile, setCurrentFile] = React.useState(null)
  const [fileGroupByType, setFileGroupByType] = React.useState({})
  const { lesson: lessonId } = useParams()
  const { t } = useTranslation('common')

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

  React.useEffect(() => {
    setFiles(resources)
    groupFileByType(resources)
  }, [resources])

  const handleSelect = (e) => {
    const files = Object.entries(e.target.files).map(([id, file]) => file)
    setSelectedFiles(files)
  }

  const handleSubmit = async () => {
    try {
      const form = new FormData()
      let names = []
      for (const index in selectedFiles) {
        form.append('resource-' + index, selectedFiles[index])
        names = [...names, selectedFiles[index].name]
      }
      const { status, data } = await uploadApi.uploadFile(lessonId, form)
      if (status === HTTP_STATUS.OK) {
        setResources([...files, ...data])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (name, type) => {
    try {
      const { status, data } = await uploadApi.deleteFile(lessonId, name, type)
      if (status === HTTP_STATUS.OK) {
        setFileGroupByType({
          ...fileGroupByType,
          imgs: fileGroupByType.imgs.filter((img) => img.name !== name)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteOther = (name, type) => {
    setFileGroupByType({
      ...fileGroupByType,
      others: fileGroupByType.others.filter((img) => img.name !== name)
    })
  }

  const download = (filename) => {
    saveAs(`${vars.server}/resources/${lessonId}/${filename}`, filename)
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          p: 1,
          background: '#efefef',
          borderRadius: 2
        }}>
        <AttachmentIcon />
        <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', ml: 1 }}>
          {t('lesson.resources')}
        </Typography>
      </Box>
      <Box>
        <ImageList sx={{ width: '100%' }} cols={8} children>
          {fileGroupByType.imgs &&
            fileGroupByType.imgs.map((file, index) => (
              <ImageListItem key={index} sx={{ border: '0.5px solid lightgrey' }}>
                <img
                  src={`${vars.server}/resources/${lessonId}/${file.name}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${vars.server}/resources/${lessonId}/${file.name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
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
                      <IconButton
                        onClick={() => handleDelete(file.name, file.type)}
                        sx={{ width: 30, height: 30, color: 'white' }}>
                        <DeleteIcon sx={{ width: 20, height: 20 }} />
                      </IconButton>
                    </Box>
                  }
                />
              </ImageListItem>
            ))}
        </ImageList>
        <Box sx={{ display: 'flex' }}>
          {fileGroupByType.others &&
            fileGroupByType.others.map((file, index) => (
              <FileIm
                key={index}
                filename={file.name}
                type={file.type}
                handleDeleteOther={handleDeleteOther}
              />
            ))}
        </Box>
        {editable && (
          <React.Fragment>
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
                {t('lesson.chooseFile')}
              </Button>
            </label>
            <Button
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
              onClick={handleSubmit}
              endIcon={<FileUploadIcon />}>
              {t('lesson.upload')}
            </Button>
          </React.Fragment>
        )}
      </Box>
    </Box>
  )
}
export default Resource
