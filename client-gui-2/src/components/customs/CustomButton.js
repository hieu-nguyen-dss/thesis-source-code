import {
  Button
} from '@mui/material'
import { styled } from '@mui/material/styles'

const CustomButton = styled(Button)(() => ({
  backgroundColor: 'rgb(255, 180, 78)',
  color: 'white',
  borderRadius: 20,
  textTransform: 'none'
}))

export default CustomButton
