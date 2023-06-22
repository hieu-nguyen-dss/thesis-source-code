import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  TextField,
  Radio,
  Grid,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Box
} from '@mui/material'
import { quizApi } from '../../apis'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSnackbar } from '../../contexts'

const Quizzes = () => {
  const { id, lesson } = useParams()
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState([
    { key: 'ChoiceA', value: '' },
    { key: 'ChoiceB', value: '' },
    { key: 'ChoiceC', value: '' },
    { key: 'ChoiceD', value: '' }
  ])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state
  const { openSnackbar } = useSnackbar()

  const handleSubmit = async (event) => {
    const user = JSON.parse(localStorage.getItem('user'))
    setIsSubmitted(true)
    event.preventDefault()
    if (state) {
      try {
        const { status } = await quizApi.updateQuestion(state.quizId, state.questionId, {
          question,
          choices,
          answer: correctAnswer
        })
        if (status === HTTP_STATUS.OK) {
          openSnackbar(SNACKBAR.SUCCESS, 'Update successfully')
          setQuestion('')
          setChoices([
            { key: 'ChoiceA', value: '' },
            { key: 'ChoiceB', value: '' },
            { key: 'ChoiceC', value: '' },
            { key: 'ChoiceD', value: '' }
          ])
          setCorrectAnswer('')
          setIsSubmitted(false)
        } else {
          openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
        }
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, 'Try again')
      }
    } else {
      try {
        const { status } = await quizApi.createQuiz(
          id,
          lesson,
          question,
          choices,
          correctAnswer,
          user.userId
        )
        if (status === HTTP_STATUS.OK) {
          openSnackbar(SNACKBAR.SUCCESS, 'Create successfully')
          setQuestion('')
          setChoices([
            { key: 'ChoiceA', value: '' },
            { key: 'ChoiceB', value: '' },
            { key: 'ChoiceC', value: '' },
            { key: 'ChoiceD', value: '' }
          ])
          setCorrectAnswer('')
          setIsSubmitted(false)
        } else {
          openSnackbar(SNACKBAR.WARNING, 'Please fill in all required field')
        }
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, 'Try again')
      }
    }
  }

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value)
  }

  const handleChoiceChange = (event) => {
    choices.forEach((ch) => {
      if (ch.key === event.target.id) {
        ch.value = event.target.value
      }
    })
    setChoices([...choices])
  }

  const handleCorrectAnswerChange = (event) => {
    setCorrectAnswer(event.target.value)
  }

  const getQuizDetail = async () => {
    try {
      const { status, data } = await quizApi.getQuestion(state.questionId)
      if (status === HTTP_STATUS.OK) {
        setQuestion(data.question.questions)
        setCorrectAnswer(data.question.answer)
        setChoices(data.question.choices)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (state) {
      getQuizDetail()
    }
  }, [])

  return (
    <React.Fragment>
      <Box sx={{ mt: 2, background: 'white', borderRadius: 3, width: '100%' }}>
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ p: 3, width: '100%' }} spacing={1}>
          <Box sx={{ p: 3, width: '100%' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
          <Box sx={{ p: 3, width: '100%' }}>
            <h4>Create New Question</h4>
            <form onSubmit={handleSubmit}>
              <TextField
                id="question"
                label="Question"
                variant="outlined"
                value={question}
                onChange={handleQuestionChange}
                required
                fullWidth
                multiline
                rows={3}
              />
              <Box>
                <FormControl component="fieldset" fullWidth="true" margin="normal">
                  <FormLabel component="legend">Choices</FormLabel>
                  <TextField
                    id="ChoiceA"
                    label="Choice A"
                    variant="outlined"
                    value={choices.find((choice) => choice.key === 'ChoiceA').value || ''}
                    onChange={handleChoiceChange}
                    required
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                  />
                  <TextField
                    id="ChoiceB"
                    label="Choice B"
                    variant="outlined"
                    value={choices.find((choice) => choice.key === 'ChoiceB').value || ''}
                    onChange={handleChoiceChange}
                    required
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                  />
                  <TextField
                    id="ChoiceC"
                    label="Choice C"
                    variant="outlined"
                    value={choices.find((choice) => choice.key === 'ChoiceC').value || ''}
                    onChange={handleChoiceChange}
                    required
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                  />
                  <TextField
                    id="ChoiceD"
                    label="Choice D"
                    variant="outlined"
                    value={choices.find((choice) => choice.key === 'ChoiceD').value || ''}
                    onChange={handleChoiceChange}
                    required
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                  />
                </FormControl>
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend">Correct Answer</FormLabel>
                  <RadioGroup
                    name="correctAnswer"
                    value={correctAnswer}
                    onChange={handleCorrectAnswerChange}>
                    <FormControlLabel value="ChoiceA" control={<Radio />} label="Choice A" />
                    <FormControlLabel value="ChoiceB" control={<Radio />} label="Choice B" />
                    <FormControlLabel value="ChoiceC" control={<Radio />} label="Choice C" />
                    <FormControlLabel value="ChoiceD" control={<Radio />} label="Choice D" />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={isSubmitted}
                  onSubmit={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Box>
    </React.Fragment>
  )
}
export default Quizzes
