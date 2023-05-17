import * as React from 'react'
import {
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  ListItemIcon,
  Button,
  TextField
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Templater from './Templater'
import TableTree from './TableTree'
import './table.css'

import { rubricApi, lpApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'
import emptyBackground from '../../assets/flaticon/empty-box.png'
import notFoundBg from '../../assets/flaticon/404.png'

const MatrixTest = (props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const [rubrics, setRubrics] = React.useState(null)
  const [newRubricName, setNewRubricName] = React.useState('')
  const [newRubric, setNewRubric] = React.useState(false)
  const [currentRubric, setCurrentRubric] = React.useState(null)
  const [yours, setYours] = React.useState(false)
  const [notFound, setNotFound] = React.useState(false)
  const { pathname } = useLocation()
  const { id, ogzId } = useParams()
  const ogzMode = pathname.includes('organizations')
  const { t } = useTranslation('common')

  const submitAddNewRubric = async () => {
    if (newRubricName === '') return
    const tree = new TableTree('root', newRubricName)
    try {
      const { status, data } = await rubricApi.createRubric(id, {
        name: newRubricName,
        tree: tree.treeToJson()
      })
      if (status === HTTP_STATUS.OK) {
        setNewRubricName('')
        setNewRubric(false)
        setRubrics([...rubrics, data])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
    setCurrentRubric(rubrics[index])
  }

  const getRubrics = async () => {
    let get
    if (ogzMode) {
      get = rubricApi.getOgzLPRubrics(ogzId, id)
    } else {
      get = rubricApi.getLPRubrics(id)
    }
    try {
      const { status, data } = await get
      if (status === HTTP_STATUS.OK) {
        const allRubrics = [...(data.rubrics || [])]
        setRubrics(allRubrics)
        setYours(data.yours || data.editable)
        if (allRubrics.length > 0) {
          setCurrentRubric(allRubrics[0])
          setSelectedIndex(0)
        }
      }
      if (status === HTTP_STATUS.NOT_FOUND) {
        setNotFound(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getRubrics()
  }, [])

  return (
    <React.Fragment>
      {rubrics && (
        <Box
          sx={{
            background: 'white',
            minWidth: 700,
            display: 'flex',
            p: 2,
            borderRadius: 3,
            mt: 2
          }}>
          <Box
            sx={{
              minWidth: 200,
              borderRight: '2px solid lightgrey',
              minHeight: 'calc(100vh - 60px)',
              mr: 4
            }}>
            <List>
              {rubrics.map((rubric, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#6c68f3',
                      color: 'white',
                      '&:hover': { backgroundColor: '#6c68f3', color: 'white' }
                    },
                    '&:hover': { backgroundColor: '#6c68f3', color: 'white' },
                    m: 1,
                    mx: 2,
                    borderRadius: 1,
                    height: 40
                  }}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {rubric.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
              {newRubric && (
                <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    placeholder={t('rubrics.namePlaceholder')}
                    value={newRubricName}
                    onChange={(e) => setNewRubricName(e.target.value)}
                  />
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <Button
                      onClick={submitAddNewRubric}
                      size="small"
                      sx={{
                        width: 60,
                        height: 30,
                        color: '#6c68f3',
                        background: 'white',
                        border: '2px solid #6c68f3',
                        textTransform: 'none',
                        mr: 1,
                        borderRadius: 1,
                        '&:hover': {
                          background: 'white'
                        }
                      }}>
                      {t('rubrics.ok')}
                    </Button>
                    <Button
                      onClick={() => {
                        setNewRubric(false)
                        setNewRubricName('')
                      }}
                      size="small"
                      sx={{
                        width: 60,
                        height: 40,
                        color: '#6c68f3',
                        background: 'white',
                        border: '2px solid #6c68f3',
                        textTransform: 'none',
                        borderRadius: 1,
                        '&:hover': {
                          background: 'white'
                        }
                      }}>
                       {t('rubrics.cancel')}
                    </Button>
                  </Box>
                </ListItem>
              )}
              {yours && (
                <ListItemButton
                  onClick={() => setNewRubric(!newRubric)}
                  sx={{
                    color: '#6c68f3',
                    background: 'white',
                    border: '2px solid #6c68f3',
                    textTransform: 'none',
                    m: 2,
                    borderRadius: 1,
                    '&:hover': {
                      background: 'white'
                    },
                    height: 40
                  }}>
                  <ListItemIcon>
                    <AddIcon sx={{ color: '#6c68f3' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t('rubrics.newRubric')}</Typography>
                    }
                  />
                </ListItemButton>
              )}
            </List>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              backgroundImage: rubrics.length === 0 && `url(${emptyBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '250px 250px'
            }}>
            <Typography variant="h5" textAlign={'center'}>
              {currentRubric ? currentRubric.name : ''}
            </Typography>
            {currentRubric && <Templater initTree={currentRubric} yours={yours} />}
          </Box>
        </Box>
      )}
      {!rubrics && (
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
          }}></Box>
      )}
    </React.Fragment>
  )
}
export default MatrixTest
