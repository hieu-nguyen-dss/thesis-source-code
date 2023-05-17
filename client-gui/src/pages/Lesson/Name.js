import * as React from 'react'
import { InputBase, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'

import { lessonApi } from '../../apis'

const Input = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 5,
    fontSize: 16,
    padding: '14px 2px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: '2px solid #fff',
    color: theme.palette.primary.main,
    '&:focus': {
      borderColor: '#2979ff',
      background: 'white'
    },
    '&:hover': {
      borderColor: '#2979ff',
      background: 'white'
    }
  }
}))

const DisabledName = styled(Box)(({ theme }) => ({
  borderRadius: 5,
  fontSize: 16,
  padding: '14px 2px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  border: '2px solid #fff',
  color: theme.palette.primary.main
}))

const Name = ({ name: initName, editable }) => {
  const [name, setName] = React.useState('')
  const { lesson: lessonId } = useParams()

  const onBlur = async () => {
    if (name === '' || name === initName) return
    try {
      const { status, data } = await lessonApi.updateLesson(lessonId, { name })
    } catch (error) {

    }
  }

  React.useEffect(() => {
    setName(initName)
  }, [initName])
  return (
    editable
      ? (
        <Input
          fullWidth
          placeholder="Lesson name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={onBlur}
        />
        )
      : (
        <DisabledName>{name}</DisabledName>
        )
  )
}
export default Name
