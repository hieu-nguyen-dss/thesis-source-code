import React, { useEffect } from 'react'
import 'react-complex-tree/lib/style-modern.css'
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Box,
  ListItem
} from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Check,
  SubdirectoryArrowRight,
  Delete
} from '@mui/icons-material'
import { useSnackbar } from '../../contexts'
import { quizApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useParams, useNavigate } from 'react-router-dom'

const TableQuizzes = ({ data, setLoading }) => {
  const questions =
    data?.questions?.map((d) => {
      return {
        id: d._id,
        description: d.questions
      }
    }) ?? []

  const [opens, setOpens] = React.useState(null)
  const { openSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleOpen = (index) => {
    const copyOpen = Array.from(opens)
    copyOpen[index] = !copyOpen[index]
    setOpens(copyOpen)
  }

  const handleDeleteQuestion = async (questionId) => {
    setLoading(false)
    try {
      const { status } = await quizApi.deleteQuestion(data._id, questionId)
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, 'Delete successfully')
        setLoading(true)
      } else {
        openSnackbar(SNACKBAR.WARNING, 'Delete failed')
        setLoading(true)
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
      setLoading(true)
    }
  }

  const handleEditQuestion = (questionId) => {
    navigate(`${window.location.pathname}/quizzes`, {
      state: {
        questionId,
        quizId: data._id
      }
    })
  }

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

  return (
    <React.Fragment>
      <List>
        {data &&
          data?.questions?.map((q, index) => (
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
                    onClick={() => handleEditQuestion(q._id)}
                    sx={{
                      color: '#6c68f3'
                    }}
                    size="small">
                    <SubdirectoryArrowRight />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteQuestion(q._id)}
                    sx={{
                      color: '#6c68f3'
                    }}
                    size="small">
                    <Delete />
                  </IconButton>
                </React.Fragment>
              </Box>
              <Collapse in={opens && opens[index]} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {q &&
                    q.choices.map((choice, idx) => (
                      <ListItem key={idx}>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => {}}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>
                                  {q.answer === choice.key && (
                                    <Check
                                      sx={{
                                        width: 14,
                                        height: 14,
                                        color: 'green',
                                        marginRight: '10px'
                                      }}
                                    />
                                  )}
                                  <span>{`${choice.value}`}</span>
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
      </List>
      <style type="text/css">{overwriteCss}</style>
    </React.Fragment>
  )
}
export default TableQuizzes
