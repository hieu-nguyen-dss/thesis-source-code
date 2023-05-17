import * as React from 'react'
import { Box, InputBase, Button, Typography } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

import { CATEGORY } from '../../constants'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid lightgrey',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}))

const Filter = ({ filter, countCate }) => {
  const [currentCategory, setCurrentCategory] = React.useState('')
  const [searchText, setSearchText] = React.useState('')
  const [selectedCate, setSelectedCate] = React.useState('')
  const { t } = useTranslation('common')
  const onChangeSearch = (e) => {
    filter(e.target.value, selectedCate)
    setSearchText(e.target.value)
  }
  const onClickCategory = (cate) => {
    setSelectedCate(cate)
    filter(searchText, cate)
  }
  const deleteFilter = () => {
    setSelectedCate('')
    setSearchText('')
    filter()
  }
  return (
    <Box sx={{ borderRight: '1px solid lightgrey', height: 'calc(100vh - 90px)', width: 200 }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          value={searchText}
          onChange={onChangeSearch}
          placeholder={`${t('search')}...`}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
        {Object.entries(CATEGORY).map(([, { code }]) => (
          <Button
            variant={code === currentCategory ? 'outlined' : 'text'}
            onClick={() => onClickCategory(code)}
            key={code}
            sx={{
              '&.MuiButton-root': { justifyContent: 'left' },
              '&:hover': { background: 'rgba(25, 118, 210, 0.2)' },
              textTransform: 'none',
              background: selectedCate === code ? 'rgba(25, 118, 210, 0.2)' : 'none'
            }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 500, fontSize: 13 }}>
                {t(`categories.${code}`)}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: 13,
                  px: 1,
                  borderRadius: 1,
                  color: selectedCate === code ? 'white' : (theme) => theme.palette.primary.main,
                  backgroundColor:
                    selectedCate === code
                      ? (theme) => theme.palette.primary.main
                      : 'rgba(25, 118, 210, 0.3)'
                }}>
                {countCate[code] || 0}
              </Typography>
            </Box>
          </Button>
        ))}
        <Button
          onClick={deleteFilter}
          color="warning"
          sx={{ textTransform: 'none', '&.MuiButton-root': { justifyContent: 'left' }, fontSize: 13 }}>
          {t('categories.deleteFilter')}
        </Button>
      </Box>
    </Box>
  )
}
export default Filter
