import * as React from 'react'
import { Box, IconButton, InputBase } from '@mui/material'
import { styled } from '@mui/material/styles'

import CustomInput from '../../../components/customs/Input'

const CustomInputId = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 2,
    fontSize: 16,
    padding: 4,
    width: 70,
    textAlign: 'center',
    fontWeight: 'bold',
    '&:focus': {
      boxShadow: `${(theme.palette.primary.main, 1)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      border: '1.5px solid #2979ff'
    }
  }
}))
const Main = (props) => {
  const { data, color, editMain } = props
  const [id, setId] = React.useState(data.id)
  const [value, setValue] = React.useState(data.value)

  const onBlur = () => {
    editMain(data.mId, { id, value })
  }
  return (
    <Box
      sx={{
        width: 500,
        borderLeft: `6px solid ${color}`,
        borderRadius: 1,
        boxShadow: color + ' 0px 1px 4px',
        display: 'flex',
        flexDirection: 'row'
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '1.5px solid #bbb',
          minWidth: 70,
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
        <CustomInputId
          value={id}
          onChange={(e) => setId(e.target.value)}
          onBlur={onBlur}
        />
      </Box>
      <Box sx={{ p: 1, flexGrow: 1 }}>
        <CustomInput
          fullWidth
          multiline
          onBlur={onBlur}
          value={value}
          sx={{ fontSize: 14 }}
          onChange={(e) => setValue(e.target.value)}
        />
      </Box>
    </Box>
  )
}
export default Main
