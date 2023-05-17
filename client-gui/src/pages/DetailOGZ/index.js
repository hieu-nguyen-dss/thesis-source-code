import * as React from 'react'
import { InputBase, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useParams, useLocation } from 'react-router-dom'

import { ogzApi } from '../../apis'
import { useBreadcrumb, useDocumentTitle } from '../../contexts'
import LPs from '../../components/LPs'
import MyTeachers from './MyTeachers'

const Input = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 5,
    fontSize: 16,
    padding: '14px 2px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: '2px solid #f0f2f5',
    marginBottom: '10px',
    color: theme.palette.primary.main,
    '&:focus': {
      borderColor: '#2979ff',
      background: 'white'
    },
    '&:hover': {
      borderColor: '#2979ff',
      background: 'white'
    }
  }
}))

const DetailOGZ = (props) => {
  const [detail, setDetail] = React.useState(null)
  const { ogzId } = useParams()
  const { pathname } = useLocation()
  const { handleAddBreadcrumb } = useBreadcrumb()
  const { setTitle } = useDocumentTitle()
  const [youAreAdmin, setYouAreAdmin] = React.useState(false)

  const getOgzDetail = async () => {
    try {
      const { status, data } = await ogzApi.getOgzDetail(ogzId)
      if (data) {
        handleAddBreadcrumb(pathname, data.ogzDetail.name)
        setTitle(`${document.title} | ${data.ogzDetail.name}`)
        setDetail(data)
        setYouAreAdmin(!!data.ogzDetail.youAreAdmin)
      }
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    getOgzDetail()
  }, [])
  return (
    <Box>
      {detail && (
        <>
          <Input defaultValue={detail.ogzDetail.name} />
          <MyTeachers
            members={detail.members}
            youAreAdmin={youAreAdmin}
            setYouAreAdmin={setYouAreAdmin}
          />
          <LPs
            lps={detail.ogzDetail.learningPaths}
            youAreAdmin={youAreAdmin}
            setYouAreAdmin={setYouAreAdmin}
          />
        </>
      )}
    </Box>
  )
}
export default DetailOGZ
