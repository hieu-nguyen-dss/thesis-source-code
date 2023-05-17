import * as React from 'react'
import { Box, Button } from '@mui/material'
import { nanoid } from 'nanoid'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import FullMainOutcome from './FullMainOutcome'
import { COLOR_PALLETE, HTTP_STATUS, SNACKBAR } from '../../../constants'
import { useSnackbar } from '../../../contexts'
import emptyBackground from '../../../assets/flaticon/empty-box.png'
import { lpApi } from '../../../apis'
import notFoundBg from '../../../assets/flaticon/404.png'

const Tree = (props) => {
  const { data } = props
  const [mains, setMains] = React.useState([])
  const [subs, setSubs] = React.useState([])
  const [initMains, setInitMains] = React.useState([])
  const [initSubs, setInitSubs] = React.useState([])
  const [notFound, setNotFound] = React.useState(false)
  const [yours, setYours] = React.useState(false)
  const { id: learningPathId, ogzId } = useParams()
  const { openSnackbar } = useSnackbar()
  const { t } = useTranslation('common')
  const [groupByParent, setGroupByParent] = React.useState(null)
  const { pathname } = useLocation()
  const ogzMode = pathname.includes('organizations')

  const addSub = (sub) => {
    setSubs([...subs, sub])
  }

  const removeSub = (sId) => {
    const afterSubs = subs.filter((sub) => sub.sId !== sId)
    setSubs(afterSubs)
  }

  const addMainBefore = (mainId) => {
    const index = mains.findIndex((main) => main.mId === mainId)
    const copyMains = mains.slice()
    copyMains.splice(index, 0, { mId: nanoid(6), id: 'id', value: 'new main' })
    console.log(copyMains)
    setMains(copyMains)
  }

  const addMainAfter = (mainId) => {
    const index = mains.findIndex((main) => main.mId === mainId)
    const copyMains = mains.slice()
    copyMains.splice(index + 1, 0, { mId: nanoid(6), id: 'id', value: 'new main' })
    setMains(copyMains)
  }

  const deleteMain = (mId) => {
    setMains(mains.filter((main) => main.mId !== mId))
    setSubs(subs.filter((sub) => sub.parent !== mId))
  }

  const editSub = (sId, editData) => {
    const index = subs.findIndex((sub) => sub.sId === sId)
    const updatedSub = { ...subs[index], ...editData }
    const copySubs = subs.slice()
    copySubs.splice(index, 1, updatedSub)
    setSubs(copySubs)
  }

  const editMain = (mId, editData) => {
    const index = mains.findIndex((main) => main.mId === mId)
    const copyMains = mains.slice()
    const updatedMain = { ...mains[index], ...editData }
    copyMains.splice(index, 1, updatedMain)
    setMains(copyMains)
  }

  const onSubmit = async () => {
    try {
      const outcomes = { mains, subs }
      const { status, data } = await lpApi.editLP(learningPathId, {
        outcomes: JSON.stringify(outcomes)
      })
      if (status === HTTP_STATUS.OK) {
        setInitMains(mains)
        setInitSubs(subs)
        openSnackbar(SNACKBAR.SUCCESS, 'Save successfully')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  const getOutcomes = async () => {
    // if (data) {
    //   const parsedOutcomes = JSON.parse(data)
    //   const mains = parsedOutcomes.mains || []
    //   const subs = parsedOutcomes.subs || []
    //   setMains(mains)
    //   setSubs(subs)
    //   setInitMains(mains)
    //   setInitSubs(subs)
    //   return
    // }
    try {
      let get
      if (ogzMode) {
        get = lpApi.getOgzLPDetail(learningPathId, ogzId)
      } else {
        get = lpApi.getLPDetail(learningPathId)
      }
      const { status, data } = await get
      if (status === HTTP_STATUS.OK) {
        setYours(data.yours || data.editable)
        const parsedOutcomes = JSON.parse(data.outcomes)
        const mains = parsedOutcomes.mains || []
        const subs = parsedOutcomes.subs || []
        setMains(mains)
        setSubs(subs)
        setInitMains(mains)
        setInitSubs(subs)
      }
      if (status === HTTP_STATUS.NOT_FOUND) {
        setNotFound(true)
      }
    } catch (error) {}
  }

  const addNewMain = () => {
    setMains([...mains, { mId: nanoid(6), id: 'id', value: '' }])
  }

  const onCancelChange = () => {
    setMains(initMains)
    setSubs(initSubs)
  }

  React.useEffect(() => {
    getOutcomes()
  }, [])

  React.useEffect(() => {
    const groupOutComeByParent = subs.reduce(
      (res, cur) => ({
        ...res,
        [cur.parent]: [...(res[cur.parent] || []), { sId: cur.sId, id: cur.id, value: cur.value }]
      }),
      {}
    )
    setGroupByParent(groupOutComeByParent)
  }, [mains, subs])

  return (
    <React.Fragment>
      {!notFound && (
        <>
          <Box
            sx={{
              height: 'calc(100vh - 140px)',
              overflow: 'scroll',
              p: 3,
              backgroundImage: mains.length === 0 && `url(${emptyBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '250px 250px'
            }}>
            {mains.length === 0 && yours && (
              <Button
                size="small"
                variant="outlined"
                onClick={addNewMain}
                sx={{
                  borderRadius: 1,
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  ml: 3.9,
                  '&:hover': {
                    background: 'white',
                    border: '2px solid #6c68f3'
                  }
                }}>
                {t('outcomes.createNew')}
              </Button>
            )}
            {mains &&
              groupByParent &&
              mains.map((main, index) => (
                <React.Fragment key={main.mId}>
                  <FullMainOutcome
                    main={main}
                    color={COLOR_PALLETE[index % 7]}
                    subs={groupByParent[main.mId]}
                    addSub={addSub}
                    removeSub={removeSub}
                    addMainBefore={addMainBefore}
                    addMainAfter={addMainAfter}
                    deleteMain={deleteMain}
                    editSub={editSub}
                    editMain={editMain}
                  />
                </React.Fragment>
              ))}
          </Box>
          {yours && (
            <Box
              sx={{
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                mt: 4
              }}>
              <Button
                onClick={onSubmit}
                size="small"
                sx={{
                  borderRadius: 1,
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'white'
                  }
                }}>
                {t('button.saveChange')}
              </Button>
              <Button
                onClick={onCancelChange}
                size="small"
                sx={{
                  borderRadius: 1,
                  color: '#6c68f3',
                  background: 'white',
                  border: '2px solid #6c68f3',
                  textTransform: 'none',
                  ml: 3.9,
                  '&:hover': {
                    background: 'white'
                  }
                }}>
                {t('button.cancel')}
              </Button>
            </Box>
          )}
        </>
      )}
      {notFound && (
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
export default Tree
