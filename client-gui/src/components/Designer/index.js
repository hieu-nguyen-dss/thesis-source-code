import * as React from 'react'
import { Container, Box } from '@mui/material'

import Kanban1 from './Kanban1'
import Timeline from '../Timeline'
import TimeChart from './TimeChart'
import { DesignerProvider } from '../../contexts'

const Designer = ({ lessonParts, updateHistories, resources, editable }) => {
  return (
    <DesignerProvider
      lessonParts={lessonParts}
      updateHistories={updateHistories}
      resources={resources}
      editable={editable}>
      <Kanban1 />
      <Box sx={{ display: 'flex', mt: 5 }}>
        <TimeChart />
        <Timeline />
      </Box>
    </DesignerProvider>
  )
}
export default Designer
