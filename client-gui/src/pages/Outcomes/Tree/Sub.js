import * as React from 'react'
import { Box, IconButton, InputBase } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import { useResizeDetector } from 'react-resize-detector'

import { styled, alpha } from '@mui/material/styles'

const CustomInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 2,
    fontSize: 14,
    padding: 4,
    minWidth: 200,
    '&:focus': {
      boxShadow: `${(theme.palette.primary.main, 1)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      border: '1.5px solid #2979ff'
    }
  }
}))

const CustomInput1 = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 2,
    fontSize: 14,
    padding: 4,
    width: 70,
    textAlign: 'center',
    '&:focus': {
      boxShadow: `${(theme.palette.primary.main, 1)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      border: '1.5px solid #2979ff'
    }
  }
}))

const Sub = (props) => {
  const { data, color, updateCurveCoor, editSub, handleRemoveSub, removeRef } = props
  const [id, setId] = React.useState(data.id)
  const [value, setValue] = React.useState(data.value)
  const ref = React.useRef()
  const { width, height } = useResizeDetector({ targetRef: ref })

  const onBlur = () => {
    editSub(data.sId, { id, value })
  }

  const deleteSub = () => {
    // removeRef(data.sId)
    handleRemoveSub(data.sId)
  }

  React.useLayoutEffect(() => {
    updateCurveCoor(ref)
  }, [width, height])

  return (
    <Box
      ref={ref}
      sx={{
        height: 'fit-content',
        borderLeft: `6px solid ${color}`,
        borderRadius: 1,
        boxShadow: color + ' 0px 1px 4px',
        display: 'flex',
        flexDirection: 'row',
        m: '0px 10px',
        position: 'relative'
      }}>
        <IconButton onClick={deleteSub} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 99 }} size='small' >
          <DeleteIcon />
        </IconButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '1.5px solid #bbb',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 'bold'
        }}>
        <CustomInput1
          sx={{ fontWeight: 'bold', fontSize: 11 }}
          value={id}
          onChange={(e) => setId(e.target.value)}
          onBlur={onBlur}
        />
      </Box>
      <Box sx={{ p: 1, flexGrow: 1, fontSize: 13 }}>
        <CustomInput
          sx={{ fontSize: 11, lineHeight: 1.3 }}
          multiline
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      </Box>
    </Box>
  )
}
export default Sub
