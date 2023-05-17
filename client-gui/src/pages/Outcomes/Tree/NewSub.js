import * as React from 'react'
import { Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useResizeDetector } from 'react-resize-detector'

import Input from '../../../components/customs/Input'

const NewSub = (props) => {
  const { color, removeCurveCoor, updateCurveCoor } = props
  const [value, setValue] = React.useState('')
  const ref = React.useRef()
  const { width, height } = useResizeDetector({ targetRef: ref })
  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const onCancelNewSub = () => {
    removeCurveCoor()
  }
  React.useEffect(() => {
    updateCurveCoor(ref.current.getBoundingClientRect().left)
  }, [width, height])
  return (
    <Box
      ref={ref}
      sx={{
        width: 400,
        border: `solid 3px ${color}`,
        ml: 2,
        mr: 2,
        p: 2,
        pt: 1,
        borderLeft: `6px solid ${color}`,
        borderRadius: 2,
        boxShadow: color + ' 0px 1px 4px'
      }}>
      <Box
        sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <IconButton onClick={onCancelNewSub} sx={{ width: 20, height: 20 }}>
          <CloseIcon sx={{ width: 15, height: 15 }} />
        </IconButton>
      </Box>
      <Input
        fullWidth
        value={value}
        onChange={handleChange}
        multiline
        autoFocus
        sx={{ fontSize: '13px', lineHeight: 1.5 }}
      />
    </Box>
  )
}
export default NewSub
