import * as React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

import Header from './Header'
import Menu from './Menu'
import HeaderV2 from './HeaderV2'

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Menu />
      <Box sx={{ flexGrow: 1, height: 'calc(100vh - 2rem)', m: '0.5rem', overflowY: 'scroll' }}>
        <HeaderV2 />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
