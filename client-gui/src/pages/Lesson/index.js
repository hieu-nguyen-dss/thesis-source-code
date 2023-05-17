import * as React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { useParams, useLocation, Link } from 'react-router-dom'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Designer from '../../components/Designer'
import Name from './Name'
import Preparation from './Preparation'
import Outcome from './Outcome'
import Content from './Content'
import Resource from './Resource'
import Comment from '../../components/Comment'
import { lessonApi, quizApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'
import { useDocumentTitle, useBreadcrumb } from '../../contexts'
import TableQuizzes from './TableQuizzes'
import './index.css'

import notFoundBg from '../../assets/flaticon/404.png'

const Lesson = (props) => {
  const [outcomes, setOutcomes] = React.useState('{}')
  const [data, setData] = React.useState([])
  const [lessonOutcomes, setLessonOutcomes] = React.useState(
    '{"knowledges":{},"skill":{},"attitudes":{}}'
  )
  const [content, setContent] = React.useState('{"contentIds":[],"contents":{}}')
  const [lessonDetail, setLessonDetail] = React.useState(null)
  const [preparation, setPreparation] = React.useState('')
  const [commentIds, setCommentIds] = React.useState([])
  const [name, setName] = React.useState('')
  const [resources, setResources] = React.useState([])
  const [editable, setEditable] = React.useState(false)
  const [ownerId, setOwnerId] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const { id, lesson, ogzId } = useParams()
  const { setTitle } = useDocumentTitle()
  const { pathname } = useLocation()
  const { handleAddBreadcrumb } = useBreadcrumb()
  const ogzMode = pathname.includes('organizations')
  const getDetail = async () => {
    let get
    if (ogzMode) {
      get = lessonApi.getOgzLesson(ogzId, id, lesson)
    } else {
      get = lessonApi.getLesson(id, lesson)
    }
    try {
      const { status, data } = await get
      if (status === HTTP_STATUS.OK) {
        const { lesson, outcomes, ownerId } = data
        setOwnerId(ownerId)
        if (outcomes) setOutcomes(outcomes)
        if (lesson.content) setContent(lesson.content)
        if (lesson.outcomes) setLessonOutcomes(lesson.outcomes)
        if (lesson.preparation) setPreparation(lesson.preparation)
        if (lesson.resources) setResources(lesson.resources)
        if (lesson.yours) setEditable(lesson.yours)
        if (lesson.comments) setCommentIds(lesson.comments)
        handleAddBreadcrumb(pathname, `Lesson ${lesson.name}`)
        setName(lesson.name)
        setLessonDetail(lesson)
        setTitle(`${document.title} | Lesson ${lesson.name}`)
      }
      if (status === HTTP_STATUS.NOT_FOUND) {
        setNotFound(true)
      }
    } catch (error) {}
  }
  const getListQuizz = async() => {
    setLoading(true)
    try {
      const { status, data } = await quizApi.getQuiz(id, lesson)
      if (status === HTTP_STATUS.OK) {
        setData(data?.quizzes[0]?.questions)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    getDetail()
    getListQuizz()
  }, [])
  return (
    <React.Fragment>
      {lessonDetail && (
        <Box sx={{ mt: 2, background: 'white', borderRadius: 3, width: 'fit-content' }}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ p: 3 }} spacing={1}>
            <Grid item xs={4} sm={8} md={12}>
              <Name name={name} editable={editable} />
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Outcome outcomes={outcomes} lessonOutcomes={lessonOutcomes} editable={editable} />
            </Grid>
            <Grid item xs={2} sm={4} md={6} sx={{ pr: 1 }}>
              <Content content={content} editable={editable} />
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <Preparation preparation={preparation} editable={editable} />
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Resource resources={resources} setResources={setResources} editable={editable} />
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  p: 1,
                  background: '#efefef',
                  borderRadius: 2
                }}>
                <AttachmentIcon />
                <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', ml: 1 }}>
                  <Link style={{ textDecoration: 'none', color: 'black' }} to={`${pathname}/quizzes`}>
                    Quizz
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ p: 3, width: '100%' }}>
                { !loading && <TableQuizzes data={data}/>}
              </Box>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              {lessonDetail && (
                <Designer
                  lessonParts={lessonDetail.lessonParts}
                  updateHistories={lessonDetail.updateHistories}
                  resources={resources}
                  editable={editable}
                />
              )}
            </Grid>
          </Grid>
          <Comment commentIds={commentIds} type="lesson" ownerId={ownerId} />
        </Box>
      )}
      {!lessonDetail && (
        <Box
          sx={{
            background: 'white',
            p: 2,
            mt: 2,
            borderRadius: 3,
            minHeight: 'calc(100vh - 140px)',
            backgroundImage: notFound ? `url(${notFoundBg})` : 'none',
            backgroundSize: 'cover 5%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}></Box>
      )}
    </React.Fragment>
  )
}
export default Lesson
