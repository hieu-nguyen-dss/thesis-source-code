import {
  useLocation,
  Navigate
} from 'react-router-dom'

import { useAuth } from '../../contexts'

const RequireAuthRoute = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()
  if (!auth.user || !auth.token) {
    console.log('No auth')
    return (
      <Navigate to='/login' state={ { from: location } } />
    )
  }
  return children
}

export default RequireAuthRoute
