import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree'
import React, { useEffect, useState } from 'react'
import 'react-complex-tree/lib/style-modern.css'
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  ListItem,
  Popover
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Check,
  Close,
  SubdirectoryArrowRight,
  Delete
} from '@mui/icons-material'
import { useSnackbar } from '../../contexts'
import { quizApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

const TableQuizzes = ({ data }) => {
  const questions = data?.map(d => d.questions) ?? []
  const [opens, setOpens] = React.useState(null)
  const [submitting, setSubmiting] = React.useState(false)
  const { openSnackbar } = useSnackbar()
  const { id: learningPathId, lesson: lessonId } = useParams()

  useEffect(() => {
    if (questions && questions.length) {
      setOpens([...Array(data.length).fill(false)])
    }
  }, [questions.length])

  const overwriteCss = `
    .MuiBox-root .css-11n0r2k {
      padding: 0px;
    }
  `
  const handleOpen = (index) => {
    const copyOpen = Array.from(opens)
    copyOpen[index] = !copyOpen[index]
    setOpens(copyOpen)
  }

  return (
    <React.Fragment>
      <List>
        {data && data.map((q, index) => (
            <React.Fragment key={index}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <ListItemButton sx={{ flexGrow: 1 }} onClick={() => handleOpen(index)}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 'bold' }}>{`${index + 1}. ${
                        q.questions
                      }`}</Typography>
                    }
                  />
                 {opens && opens[index] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <React.Fragment>
                    <IconButton
                      onClick={() => {}}
                      sx={{
                        color: '#6c68f3'
                      }}
                      size="small">
                      <SubdirectoryArrowRight />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {}}
                      sx={{
                        color: '#6c68f3'
                      }}
                      size="small">
                      <Delete />
                    </IconButton>
                  </React.Fragment>
              </Box>
              <Collapse in={opens && opens[index]} timeout="auto" unmountOnExit>
                {console.log('answer: ', q.answer)}
                <List disablePadding>
                  {q &&
                    q.choices.map((choice, idx) => (
                      <ListItem key={idx}>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => {}}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>
                                  { q.answer === choice.key && <Check sx={{ width: 14, height: 14, color: 'green', marginRight: '10px' }} /> }
                                  <span>{`${choice.value}`}</span>
                                  </Typography>
                              </Box>
                            }
                          />
                        </ListItemButton>
                        <IconButton
                          onClick={(e) => {}}
                          size="small"
                          sx={{ color: '#6c68f3' }}>
                          <Delete />
                        </IconButton>
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </React.Fragment>
        ))}
      </List>
      <style type='text/css'>{overwriteCss}</style>
    </React.Fragment>
  )
}
export default TableQuizzes
