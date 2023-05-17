import * as React from 'react'
import { Box, Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import outcomeIcon from '../../assets/flaticon/objective.png'

const Outcome = (props) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  return (
    <Button
      onClick={() => navigate(`${pathname}/outcomes`, { state: { passData: props.outcomes } })}
      sx={{
        color: '#6c68f3',
        background: 'white',
        fontWeight: 500,
        border: '1px solid #F7F8F9',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
        m: 2,
        mt: 0,
        flexGrow: 1,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <img src={outcomeIcon} width="140" height="140" />
      </Box>
      <Box sx={{ fontSize: 14, textAlign: 'center' }}>{t('learningPath.outcomes')}</Box>
    </Button>
  )
}
export default Outcome
