import * as React from 'react'
import { useParams } from 'react-router-dom'

import { roadmapApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'

const RoadmapContext = React.createContext({})

const RoadmapProvider = ({ children }) => {
  const [name, setName] = React.useState(null)
  const [steps, setSteps] = React.useState(null)
  const [currentStep, setCurrentStep] = React.useState(null)
  const { roadmapId } = useParams()
  const getRoadmapDetail = async () => {
    try {
      const { status, data } = await roadmapApi.getRoadmapDetail(roadmapId)
      if (status === HTTP_STATUS.OK) {
        setName(data.name)
        setSteps(data.steps.reduce((res, cur) => ({ ...res, [cur._id]: cur }), {}))
        if (data.steps.length > 0) {
          setCurrentStep(data.steps[0]._id)
        }
      }
    } catch (error) {

    }
  }
  return (
    <RoadmapContext.Provider value={{ name, steps, currentStep, setCurrentStep }} >
      {children}
    </RoadmapContext.Provider>
  )
}
export {
  RoadmapProvider
}
