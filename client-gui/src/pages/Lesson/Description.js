import * as React from 'react'
import {
  Box,
  IconButton,
  Container,
  Grid,
  InputBase,
  Typography,
  Select,
  MenuItem
} from '@mui/material'
import { styled } from '@mui/material/styles'

import Name from './Name'
import Preparation from './Preparation'
import Outcome from './Outcome'
import Content from './Content'
import Resource from './Resource'

const SmallSelect = styled(Select)(() => ({
  padding: 1,
  fontSize: 14,
  height: 30,
  width: 300
}))

const ModeOfDelivery = (props) => {
  const { value } = props
  return (
    <Grid item xs={2} sm={4} md={6}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pr: 10
        }}>
        <Typography variant="h7">Mode of delivery </Typography>
        <SmallSelect value={value}>
          <MenuItem value={'online'}>Online</MenuItem>
          <MenuItem value={'offline'}>Offline</MenuItem>
          <MenuItem value={'blended'}>Blended</MenuItem>
          <MenuItem value={'experiment'}>Experiment</MenuItem>
        </SmallSelect>
      </Box>
    </Grid>
  )
}

const Description = ({ detail }) => {
  const { outcomes, lessonOutcomes, content, preparation, name } = detail
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} flexGrow={1} spacing={1} >
          <Grid item xs={4} sm={8} md={12} >
            <Name name={name} />
          </Grid>
          <Outcome outcomes={outcomes} lessonOutcomes={lessonOutcomes} />
          <Content content={content} />
          <Preparation preparation={preparation} />
          <Grid item xs={4} sm={8} md={12} >
            <Resource />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
export default Description
