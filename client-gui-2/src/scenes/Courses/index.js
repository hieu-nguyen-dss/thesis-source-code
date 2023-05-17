import React, { useEffect, useState } from 'react'
import SectionMenu from '../../components/SectionMenu'
import classes from './index.module.css'
import { BsColumnsGap } from 'react-icons/bs'
import { AiOutlineMenu } from 'react-icons/ai'
import LeftSideBar from './components/LeftSideBar'
import CourseList from './components/CourseList'
import { HTTP_STATUS } from '../../constants'
import lpApi from '../../apis/courses'
const Courses = () => {
  const [optionSort, setOptionSort] = useState('nameAZ')
  const [LPs, setLPs] = useState([])
  const [countCate, setCountCate] = React.useState({})
  const [filterLPs, setFilterLPs] = React.useState([])

  const getLPs = async () => {
    const { status, data } = await lpApi.getMyLPs()

    if (status === HTTP_STATUS.OK) {
      setLPs(data)
      setFilterLPs(data)
      countByCate([...data])
    }
  }

  const removeAscent = (str) => {
    if (str === null || str === undefined) return str
    str = str.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    return str
  }

  const isMatch = (lpName, searchStr) => {
    const name = removeAscent(lpName)
    const search = new RegExp(removeAscent(searchStr))
    return search.test(name)
  }

  
  const filter = (str = '', category = '') => {
    const crs = LPs.filter((LP) => {
      if (category === '') {
        return isMatch(LP.name, str) && isMatch(LP.category, category)
      } else {
        return isMatch(LP.name, str) && category === LP.category
      }
    })
    setFilterLPs(crs)
  }

  const countByCate = (LPs) => {
    const rs = LPs.reduce(
      (res, cur) => ({ ...res, [cur.category]: (res[cur.category] || 0) + 1 }),
      {}
    )
    setCountCate(rs)
  }

  React.useEffect(() => {
    getLPs()
  }, [])


  const handlerOnChangeSort = (e) => {
    setOptionSort(e.target.value);
  }

  return (
    <div>
      <SectionMenu menuCurrent="Courses" />
      <div className={classes.content}>
        <div className="row">
          <LeftSideBar filter={filter} countCate={countCate} />
          <div className="col-10">
            <div className="container">
              <div className="row">
                <div className={`col-3 ${classes.hi}`}>
                  <p>{LPs?.length || 0} Courses Found</p>
                </div>
              </div>
              <CourseList
                loading={false}
                courses={filterLPs}
                checkCourse={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses;
