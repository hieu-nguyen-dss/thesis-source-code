import * as React from 'react'
import {} from '@mui/material'
import { useNavigate, matchPath, useLocation } from 'react-router-dom'

const BreadcrumbContext = React.createContext()

const BreadcrumbProvider = ({ children }) => {
  const { pathname } = useLocation()
  const [breadcrumbs, setBreadcrumbs] = React.useState([{ link: '/', name: 'Dashboard' }])

  const handleAddBreadcrumb = (link, name) => {
    if (pathname === '/') {
      const copy = breadcrumbs.slice(0, 1)
      setBreadcrumbs(copy)
      return
    }
    const breadcrumbsLength = breadcrumbs.length
    let i = breadcrumbsLength - 1
    for (; i >= 0; i--) {
      const lastBreadcrumb = breadcrumbs[i]
      if (
        matchPath({ path: lastBreadcrumb.link, end: false }, link) &&
        link !== lastBreadcrumb.link
      ) {
        break
      }
    }
    if (i === breadcrumbsLength - 1) {
      setBreadcrumbs([...breadcrumbs, { link, name }])
      return
    }
    const newBreadcrumbs = [...breadcrumbs.slice(0, i + 1), { link, name }]
    setBreadcrumbs(newBreadcrumbs)
  }

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, handleAddBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

const useBreadcrumb = () => React.useContext(BreadcrumbContext)
export { BreadcrumbProvider, useBreadcrumb }
