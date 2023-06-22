import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Box, InputBase } from '@mui/material'
import ListStudent from './ListStudents'
import AddIcon from '@mui/icons-material/Add'
import InviteUserModal from './InviteUserModal'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid lightgrey',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginBottom: '20px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}))

const StudentManagement = (props) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [searchText, setSearchText] = React.useState('')

  const onChangeSearch = (e) => {
    setSearchText(e.target.value)
  }
  return (
    <React.Fragment>
      <Box
        sx={{
          background: 'white',
          p: 2,
          mt: 2,
          borderRadius: 3,
          minHeight: 'calc(100vh - 140px)'
        }}>
        <Box
          sx={{
            mb: 2
          }}>
          <Button
            onClick={() => setOpen(true)}
            size="small"
            sx={{
              mr: 1,
              color: '#6c68f3',
              background: 'white',
              border: '2px solid #6c68f3',
              textTransform: 'none'
            }}
            endIcon={<AddIcon />}>
            {t('learningPath.addStudent')}
          </Button>
        </Box>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            value={searchText}
            onChange={onChangeSearch}
            placeholder="Search student"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <ListStudent
          handleClose={handleClose}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Box>
      <InviteUserModal open={open} handleClose={handleClose} />
    </React.Fragment>
  )
}
export default StudentManagement
