/* eslint-disable no-unused-vars */
import { Routes, Outlet, Route, useNavigate } from 'react-router-dom'
import React, { Component, Suspense } from 'react'
import { LinearProgress } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'

import { privateRoutes, publicRoutes } from '../src/pages/routes'
import Layout from './layouts'
import { Auth } from './components'
import { AuthProvider, DocumentTitleProvider, SnackbarProvider, AdminProvider } from './contexts'

import './css/App.css'

function App() {
  const navigate = useNavigate()
  React.useEffect(() => {
    window.addEventListener('storage', () => {
      if (!localStorage.getItem('user')) {
        navigate('/login', { replace: true })
      }
    })
  }, [])
  return (
    <HelmetProvider>
      <DocumentTitleProvider>
        <AuthProvider>
          <SnackbarProvider>
            <AdminProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {privateRoutes.map(({ component: Component, path, ...rest }, i) => (
                    <Route
                      key={`[private]-${i}`}
                      path={path}
                      {...rest}
                      element={
                        <Auth.RequireAuthRoute>
                          <Suspense fallback={'Loading ...'}>
                            <Component />
                          </Suspense>
                        </Auth.RequireAuthRoute>
                      }
                    />
                  ))}
                </Route>
                {publicRoutes.map(({ component: Component, path, ...rest }, i) => (
                  <Route
                    key={`[public]-${i}`}
                    path={path}
                    {...rest}
                    element={
                      <Suspense fallback={<LinearProgress />}>
                        <Component />
                      </Suspense>
                    }
                  />
                ))}
              </Routes>
            </AdminProvider>
          </SnackbarProvider>
        </AuthProvider>
      </DocumentTitleProvider>
    </HelmetProvider>
  )
}

export default App
