import * as React from 'react'
import {
  Box,
  Stack,
  Card,
  Typography,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { useTranslation } from 'react-i18next'

import vars from '../../config/vars'

const MyOrganizations = ({ organizations }) => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
      {organizations &&
        organizations.map((ogz, index) => (
          <Box key={index} style={{ textTransform: 'none', textDecoration: 'none' }}>
            <Card variant="outlined" sx={{ minWidth: 300 }}>
              <CardMedia
                component="img"
                height="140"
                image={`${vars.server}/resources/organizations/${ogz._id}/${ogz.backgroundImg}`}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom sx={{ fontSize: 16 }}>
                  {ogz.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ogz.learningPaths.length} {t('organization.course')}
                </Typography>
              </CardContent>
              <CardActions>
                <Stack direction="row">
                  <Tooltip title={t('organization.information')}>
                    <IconButton onClick={() => navigate(`/organizations/information/${ogz._id}`)}>
                      <PreviewRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('organization.detail')}>
                    <IconButton onClick={() => navigate(`/organizations/${ogz._id}`)}>
                      <HomeRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardActions>
            </Card>
          </Box>
        ))}
    </Stack>
  )
}
export default MyOrganizations
