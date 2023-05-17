import * as React from 'react'
import {
  List,
  ListItem,
  Menu,
  MenuItem,
  ListItemText
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { LANGUAGE } from '../../constants'

const options = [
  { lang: LANGUAGE.EN, text: 'English' },
  { lang: LANGUAGE.VI, text: 'Tiếng Việt' }
]

export default function SimpleListMenu() {
  const { t, i18n } = useTranslation('common')
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const open = Boolean(anchorEl)
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index)
    i18n.changeLanguage(options[index].lang)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <List component="nav" aria-label="Device settings" sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}>
          <ListItemText primary={t('pages.settings.language')} secondary={options[selectedIndex].text} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox'
        }}>
        {options.map((option, index) => (
          <MenuItem
            key={option.text}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}>
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}
