import * as React from 'react'
import { useLocation } from 'react-router-dom'

import { analysisApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'

const AdminContext = React.createContext({})

const AdminProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = React.useState(null)
  const { pathname } = useLocation()
  const getDashboardStatistics = async () => {
    if (pathname === '/login' || pathname === 'signup') {
      return
    }
    try {
      const { status, data } = await analysisApi.getDashboardStatistics()
      if (status === HTTP_STATUS.OK) {
        console.log(data)
        setDashboardData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    getDashboardStatistics()
  }, [])
  return (
    <AdminContext.Provider value={{ dashboardData, setDashboardData }}>
      {(dashboardData || pathname === '/login' || pathname === '/signup') && children}
    </AdminContext.Provider>
  )
}

const useAdmin = () => React.useContext(AdminContext)

export { useAdmin, AdminProvider }
