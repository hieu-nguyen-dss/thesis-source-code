import * as React from 'react'
import { useLocation } from 'react-router-dom'

import LPs from '../../components/LPs'
import { useDocumentTitle, useBreadcrumb } from '../../contexts'

const MyLPs = (props) => {
  const { setTitle } = useDocumentTitle()
  const { handleAddBreadcrumb } = useBreadcrumb()
  const { pathname } = useLocation()
  React.useEffect(() => {
    setTitle('Learning Path')
    handleAddBreadcrumb(pathname, 'Learning Path')
  }, [])
  return (
    <LPs />
  )
}
export default MyLPs
