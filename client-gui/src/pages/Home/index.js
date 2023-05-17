import * as React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { orange } from '@mui/material/colors'
import { useTranslation } from 'react-i18next'

import MenuItem from './MenuItem'
import landingImg from '../../assets/images/4783543.png'
import { useDocumentTitle } from '../../contexts'
import menuIcons from './menuIcons'

const ColorButton = styled(Button)(({ theme }) => ({
  color: 'white',
  width: 200,
  height: 50,
  textTransform: 'none',
  fontSize: 24,
  borderRadius: '50px',
  marginTop: '40px',
  backgroundColor: orange[500],
  '&:hover': {
    backgroundColor: orange[700]
  }
}))

const menu = [
  {
    id: 'mylps',
    link: '/my-lps',
    name: 'pages.home.myLps.name',
    description: 'pages.home.myLps.description'
  },
  {
    id: 'discovery',
    link: '/discovery',
    name: 'pages.home.discovery.name',
    description: 'pages.home.discovery.description'
  },
  {
    id: 'organization',
    link: '/organizations',
    name: 'pages.home.organization.name',
    description: 'pages.home.organization.description'
  }
]

const Home = (props) => {
  const documentTitle = useDocumentTitle()
  const menuRef = React.useRef()
  const { t } = useTranslation('common')
  const onClickGetStart = () => {
    menuRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    documentTitle.setTitle('Home')
  }, [])
  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ maxWidth: '100vw', display: 'flex', flexDirection: 'row' }}>
        <Box
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Typography
            sx={{
              color: 'rgb(255, 180, 78)',
              fontSize: 48,
              fontWeight: 700
            }}>
            LEARNING
          </Typography>
          <Typography
            sx={{
              ml: 10,
              color: 'rgb(255, 180, 78)',
              fontSize: 48,
              fontWeight: 700
            }}>
            DESIGNER
          </Typography>
          <Typography sx={{ fontSize: 24, maxWidth: '90%', color: 'rgb(84 81 133)', ml: 5 }}>
            {t('pages.home.description')}
          </Typography>
          {/* <Typography
            sx={{ maxWidth: '90%', color: 'rgb(84 81 133)', ml: 5 }}>
            Creating and sharing your Learning Path
          </Typography> */}
          <ColorButton onClick={onClickGetStart}>{t('pages.home.getStarted')}</ColorButton>
        </Box>
        <Box
          style={{
            width: '90%',
            height: '100vh',
            backgroundImage: `url(${landingImg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}></Box>
      </Box>
      <Box
        ref={menuRef}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          mt: 10,
          scrollBehavior: 'smooth'
        }}>
        {menu &&
          menu.map((item) => <MenuItem key={item.id} data={item} icon={menuIcons[item.id]} />)}
      </Box>
    </Box>
  )
}

export default Home
