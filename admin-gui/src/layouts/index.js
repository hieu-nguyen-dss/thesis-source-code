import * as React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

import Menu from './Menu'
import Header from './Header'

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Menu />
      <Box >
        <Header />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
