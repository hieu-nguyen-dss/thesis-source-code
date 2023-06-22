import { styled, alpha } from '@mui/material/styles'
import { InputBase } from '@mui/material'
const CustomInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 4,
    fontSize: 14,
    padding: 4,
    border: '2px solid #fff',
    '&:focus': {
      boxShadow: `${(theme.palette.primary.main, 1)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      border: '2px solid #2979ff'
    }
  }
}))

export default CustomInput
