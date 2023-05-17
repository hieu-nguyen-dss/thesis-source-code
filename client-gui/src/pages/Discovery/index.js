import * as React from 'react'
import { Box, Pagination, InputBase, Divider, Button, Typography } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LP from './LP'
import Filter from './Filter'
import { CATEGORY, HTTP_STATUS } from '../../constants'
import { lpApi } from '../../apis'
import { useDocumentTitle, useBreadcrumb } from '../../contexts'

const PER_PAGE = 10

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: '2px solid #1976d2',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
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
    [theme.breakpoints.up('md')]: {
      width: '50ch'
    }
  }
}))

const Discovery = (props) => {
  const [page, setPage] = React.useState(1)
  const [searchText, setSearchText] = React.useState('')
  const [query, setQuery] = React.useState({ type: 'roadmap' })
  const [result, setResult] = React.useState([])
  const [totalLp, setTotalLp] = React.useState(0)
  const [totalRm, setTotalRm] = React.useState(0)
  const [totalPage, setTotalPage] = React.useState(0)
  const [currentFilter, setCurrentFilter] = React.useState({
    category: '',
    star: '',
    searchText: '',
    type: 'roadmap'
  })
  const [countByCate, setCountByCate] = React.useState({})
  const [searchParams, setSearchParams] = useSearchParams({ type: 'roadmap' })
  const { setTitle } = useDocumentTitle()
  const { handleAddBreadcrumb } = useBreadcrumb()
  const { t } = useTranslation('common')

  const handleChangeSearchText = (e) => {
    setSearchText(e.target.value)
  }

  const handleChangePage = (event, value) => {
    setPage(value)
    filter('page', value)
  }
  const filter = (name, value) => {
    setSearchParams({ ...query, [name]: value })
    setQuery({ ...query, [name]: value })
  }

  const deleteFilter = () => {
    setQuery({})
    setSearchParams({})
    setCurrentFilter({ category: '', star: '', searchText: '', type: '' })
  }

  const searchLP = async () => {
    const params = [...searchParams]
    const query = params.reduce((res, cur) => ({ ...res, [cur[0]]: cur[1] }), {})
    const { status, data } = await lpApi.searchLP(query)
    if (status === HTTP_STATUS.OK) {
      setTotalLp(data.lps.total)
      setTotalRm(data.rms.total)
      const merge = [...data.lps.result, ...data.rms.result]
      setResult(merge)
      setCountByCate(
        merge.reduce(
          (res, cur) => ({ ...res, [cur.category]: res[cur.category] ? res[cur.category] + 1 : 1 }),
          {}
        )
      )
      setTotalPage(data.lps.total + data.rms.total)
    }
  }

  const getCurrentFilter = () => {
    const params = [...searchParams]
    let cfil = { ...currentFilter }
    for (const param of params) {
      cfil = { ...cfil, [param[0]]: param[1] }
    }
    setCurrentFilter(cfil)
  }

  React.useEffect(() => {
    handleAddBreadcrumb('/discovery', 'Discovery')
    setTitle('Discovery')
  }, [])

  React.useEffect(() => {
    searchLP()
    getCurrentFilter()
  }, [searchParams])

  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: 3,
        p: 2,
        mt: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 'calc(100vh - 140px)'
      }}>
      <Box
        className="categories"
        sx={{
          width: 200,
          height: 'calc(100vh - 140px)',
          borderRight: '2px lightgrey solid',
          pr: 2
        }}>
        <Typography
          sx={{ fontSize: 14, color: 'lightslategray', textAlign: 'center', fontWeight: 500 }}>
          {t('discovery.category')}
        </Typography>
        <Box sx={{ width: 200 }}>
          <Button
            onClick={() => filter('category', '')}
            sx={{
              width: '100%',
              '&.MuiButton-root': { justifyContent: 'space-between' },
              '&:hover': { background: 'rgba(25, 118, 210, 0.2)' },
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500
            }}>
            {t('categories.all')}
          </Button>
          {Object.entries(CATEGORY).map(([category, { code, name }], index) => {
            const isCurrentCate = code === currentFilter.category
            return (
              <Button
                onClick={() => filter('category', code)}
                key={code}
                sx={{
                  width: '100%',
                  '&.MuiButton-root': { justifyContent: 'space-between' },
                  '&:hover': { background: 'rgba(25, 118, 210, 0.2)' },
                  textTransform: 'none',
                  background: isCurrentCate ? 'rgba(25, 118, 210, 0.2)' : 'none'
                }}>
                <Typography sx={{ fontWeight: 500, fontSize: 13 }}>
                  {t(`categories.${code}`)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    px: 1,
                    borderRadius: 1,
                    color: isCurrentCate ? 'white' : (theme) => theme.palette.primary.main,
                    backgroundColor: isCurrentCate
                      ? (theme) => theme.palette.primary.main
                      : 'rgba(25, 118, 210, 0.3)'
                  }}>{`${countByCate[code] || 0}`}</Typography>
              </Button>
            )
          })}
        </Box>
      </Box>
      <Box
        className="results"
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 140px)',
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'scroll'
        }}>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={searchText}
              placeholder={t('discovery.search')}
              onChange={handleChangeSearchText}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  filter('name', searchText.trim())
                }
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Filter
            deleteFilter={deleteFilter}
            filter={filter}
            currentFilter={currentFilter}
            totalLp={totalLp}
            totalRm={totalRm}
          />
          <Box>
            {result.map((lp, index) => (
              <LP data={lp} key={index} filter={filter} />
            ))}
          </Box>
        </Box>
        <Pagination
          count={Math.ceil(totalPage / PER_PAGE)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  )
}
export default Discovery
