import * as React from 'react'
import { InputBase } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'

import { lpApi } from '../../apis'

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

const Name = ({ name: initName, editable }) => {
  const [name, setName] = React.useState('')
  const { id } = useParams()

  const onBlur = async () => {
    if (name === '' || name === initName || !editable) return
    try {
      const { status, data } = await lpApi.editLP(id, {
        name
      })
    } catch (error) {

    }
  }

  const handleChange = (e) => {
    if (!editable) return
    setName(e.target.value)
  }

  React.useEffect(() => {
    setName(initName)
  }, [initName])
  return (
    <Input
      sx={{ textAlign: 'center', flexGrow: 1, mr: 2 }}
      placeholder="Lesson name"
      value={name}
      onChange={handleChange}
      onBlur={onBlur}
    />
  )
}
export default Name
