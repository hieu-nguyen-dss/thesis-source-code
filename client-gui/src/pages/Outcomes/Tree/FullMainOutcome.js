import * as React from 'react'
import { Box, IconButton, Tooltip, Menu, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DeleteIcon from '@mui/icons-material/Delete'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'

import Curve from './Curve'
import Main from './Main'
import Sub from './Sub'

const FullMainOutcome = (props) => {
  const {
    main,
    subs,
    color,
    addSub,
    addMainBefore,
    addMainAfter,
    deleteMain,
    editSub,
    editMain,
    removeSub
  } = props
  const [subRefs, setSubRefs] = React.useState({})
  const [anchorEl, setAnchorEl] = React.useState(null)
  const boundRef = React.useRef()
  const { t } = useTranslation('common')

  const updateRef = React.useCallback(
    (id, ref) => {
      setSubRefs((r) => ({ ...r, [id]: ref }))
    },
    [subRefs]
  )
  const removeRef = React.useCallback(
    (id) => {
      setSubRefs((r) => {
        const copyRef = { ...subRefs }
        delete copyRef[id]
        return copyRef
      })
    },
    [subRefs]
  )
  const handleAddSub = () => {
    addSub({
      sId: nanoid(6),
      id: 'id',
      value: '',
      parent: main.mId
    })
  }

  const handleRemoveSub = (sId) => {
    removeSub(sId)
    removeRef(sId)
  }

  const handleOpenMore = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleCloseMore = () => {
    setAnchorEl(null)
  }
  const handleAddMainBefore = () => {
    addMainBefore(main.mId)
  }
  const handleAddMainAfter = () => {
    addMainAfter(main.mId)
  }
  const handleDeleteMain = () => {
    deleteMain(main.mId)
  }
  return (
    <Box sx={{ mt: 7, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}>
        <Main editMain={editMain} data={main} color={color} />
        <IconButton
          color="primary"
          onClick={handleOpenMore}
          sx={{ borderColor: 'inherit', borderWidth: 1.5, ml: 3, mr: 1 }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>
      <Box sx={{ height: 60 }} ref={boundRef}>
        {subRefs && (
          <Curve
            length={boundRef.current ? boundRef.current.getBoundingClientRect().width : 1500}
            coor={subRefs}
          />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          pl: '50px',
          position: 'relative'
        }}>
        {subs &&
          subs.map((sub, index) => (
            <Sub
              updateCurveCoor={(value) => updateRef(sub.sId, value)}
              removeRef={(sId) => removeRef(sId)}
              editSub={editSub}
              handleRemoveSub={handleRemoveSub}
              key={index}
              data={sub}
              color={color}
            />
          ))}
      </Box>
      <Menu
        id={`menu-more-${main.mId}`}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMore}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}>
        <MenuItem onClick={handleAddMainBefore} sx={{ fontSize: 14 }}>
          <ArrowUpwardIcon sx={{ mr: 1 }} />
          {t('outcomes.addBefore')}
        </MenuItem>
        <MenuItem onClick={handleAddMainAfter} sx={{ fontSize: 14 }}>
          <ArrowDownwardIcon sx={{ mr: 1 }} />
          {t('outcomes.addAfter')}
        </MenuItem>
        <MenuItem onClick={handleDeleteMain} sx={{ fontSize: 14 }}>
          <DeleteIcon sx={{ mr: 1 }} />
          {t('outcomes.delOutcome')}
        </MenuItem>
        <MenuItem onClick={handleAddSub} sx={{ fontSize: 14 }}>
          <SubdirectoryArrowRightIcon sx={{ mr: 1 }} />
          {t('outcomes.addSub')}
        </MenuItem>
      </Menu>
    </Box>
  )
}
export default FullMainOutcome
