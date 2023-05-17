import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { useParams, useLocation } from 'react-router-dom'

import Steps from './Steps'
import StepDetail from './StepDetail'
import Comment from '../../components/Comment'
import { roadmapApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'
import emptyBackground from '../../assets/flaticon/empty-box.png'
import { useBreadcrumb } from '../../contexts'
import Follow from './Follow'

const Roadmap = (props) => {
  const [detail, setDetail] = React.useState(null)
  const [steps, setSteps] = React.useState(null)
  const [currentStep, setCurrentStep] = React.useState(null)
  const [editable, setEditable] = React.useState(false)
  const { roadmapId } = useParams()
  const { pathname } = useLocation()
  const { handleAddBreadcrumb } = useBreadcrumb()

  const getRoadmapDetail = async () => {
    try {
      const { status, data } = await roadmapApi.getRoadmapDetail(roadmapId)
      if (status === HTTP_STATUS.OK) {
        handleAddBreadcrumb(pathname, `Roadmap ${data.name}`)
        setDetail(data)
        setEditable(data.yours)
        setSteps(data.steps.reduce((res, cur) => ({ ...res, [cur._id]: cur }), {}))
        if (data.steps.length > 0) {
          setCurrentStep(data.steps[0]._id)
        }
      }
    } catch (error) {}
  }

  const changeStepData = (currentStepId, updatedData) => {
    setSteps({
      ...steps,
      [currentStepId]: { ...steps[currentStepId], ...updatedData }
    })
  }

  React.useEffect(() => {
    getRoadmapDetail()
  }, [roadmapId])

  return (
    detail &&
    steps && (
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 18,
            color: (theme) => theme.palette.primary.main
          }}>
          {' '}
          Roadmap {detail.name}
        </Typography>
        <Box sx={{ display: 'flex', mt: 3 }}>
          <Box sx={{ width: 400, height: 'calc(100vh - 100px)', overflow: 'scroll', pb: 3 }}>
            <Follow data={detail} />
            <Steps
              editable={editable}
              steps={steps}
              setSteps={setSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </Box>
          {steps[currentStep] && (
            <Box
              className="detail"
              sx={{
                background: '#fafafa',
                flexGrow: 1,
                p: 2,
                height: 'calc(100vh - 100px)',
                overflowY: 'scroll',
                borderRadius: 3,
                '&::-webkit-scrollbar': { width: 5 }
              }}>
              <StepDetail
                ownerId={detail.ownerId._id}
                editable={editable}
                data={steps[currentStep]}
                changeStepData={(updatedData) => changeStepData(currentStep, updatedData)}
              />
            </Box>
          )}
          {!currentStep && (
            <Box
              className="detail"
              sx={{
                background: '#fafafa',
                flexGrow: 1,
                p: 2,
                height: 'calc(100vh - 100px)',
                backgroundImage: `url(${emptyBackground})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '250px 250px'
              }}></Box>
          )}
        </Box>
        <Comment
          commentIds={detail.comments || []}
          type="roadmap"
          ownerId={detail.ownerId ? detail.ownerId._id : ''}
        />
      </Box>
    )
  )
}
export default Roadmap
