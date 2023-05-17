import * as React from 'react'
import { io } from 'socket.io-client'

import vars from '../../config/vars'

const SocketContext = React.createContext({})
const socket = io(vars.socket)

const SocketProvider = ({ children }) => {
  React.useEffect(() => {
    return () => socket.disconnect()
  }, [])
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

const useSocket = () => React.useContext(SocketContext)

export { SocketProvider, useSocket }
