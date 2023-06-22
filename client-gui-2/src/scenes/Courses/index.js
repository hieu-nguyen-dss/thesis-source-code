import React, { useState } from "react";
import SectionMenu from "../../components/SectionMenu";
import LeftSideBar from "./components/LeftSideBar";
import CourseList from "./components/CourseList";
import { HTTP_STATUS } from "../../constants";
import lpApi from "../../apis/courses";
import { useAuth } from "../../contexts";

const overwriteCss = `
.content {
  padding-top: 50px;
  width: 95%;
  margin: 0 auto;
}

.filterProd {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filter {
  background-color: #f1f5f8;
  padding: 0.3rem 0.5rem;
  border-color: transparent;
  border-radius: 5px;
}

.formControl {
  margin: 20px 0px;
}

.btnCate {
  color: #617d98;
  background-color: transparent;
  text-transform: capitalize;
  cursor: pointer;
  padding: 0;
  letter-spacing: 1px;
  display: block;
  margin: 10px 0;
}

.btnCate.active {
  border: none;
  border-bottom: 1px solid #617d98 !important;
}

.hi {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.hi span {
  border: 2px solid black;
  padding: 0 3px;
  border-radius: 5px;
  font-size: 15px;
  margin-right: 10px;
  cursor: pointer;
}

.hi .hiActive {
  color: white;
  background-color: black;
}

.sortInput {
  border-color: transparent;
  font-size: 1rem;
  text-transform: capitalize;
  padding: 0.25rem 0.5rem;
}

.item {
  color: #4f4f4f;
  padding: 20px 20px;
  box-shadow: 5px 5px 10px gray;
  text-align: center;
  height: 300px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.item img {
  height: 150px;
  width: 60%;
  margin: 0 auto;
}
.item2 {
  height: 200px;
  margin-bottom: 30px;
  box-sizing: border-box;
  padding: 10px;
}
.item2 img {
  height: 200px;
  width: 200px;
  border-radius: 5px;
  margin: 0 auto;
}
.item2 .btn {
  text-transform: uppercase;
  background: #ab7a5f;
  padding: .375rem .75rem;
  letter-spacing: .1rem;
  display: inline-block;
  font-weight: 400;
  transition: all .3s linear;
  font-size: .875rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgb(0 0 0 / 20%);
  border-radius: .25rem;
  border-color: transparent;
  color: #eaded7 !important;
}
`;
const Courses = () => {
  const [LPs, setLPs] = useState([]);
  const [countCate, setCountCate] = React.useState({});
  const [filterLPs, setFilterLPs] = React.useState([]);
  const auth = useAuth();

  const getLPs = async () => {
    const { status, data } = await lpApi.getMyLPs(auth.user.userId);

    if (status === HTTP_STATUS.OK) {
      setLPs(data);
      setFilterLPs(data);
      countByCate([...data]);
    }
  };

  const removeAscent = (str) => {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  };

  const isMatch = (lpName, searchStr) => {
    const name = removeAscent(lpName);
    const search = new RegExp(removeAscent(searchStr));
    return search.test(name);
  };

  const filter = (str = "", category = "") => {
    const crs = LPs.filter((LP) => {
      if (category === "") {
        return isMatch(LP.name, str) && isMatch(LP.category, category);
      } else {
        return isMatch(LP.name, str) && category === LP.category;
      }
    });
    setFilterLPs(crs);
  };

  const countByCate = (LPs) => {
    const rs = LPs.reduce(
      (res, cur) => ({ ...res, [cur.category]: (res[cur.category] || 0) + 1 }),
      {}
    );
    setCountCate(rs);
  };

  React.useEffect(() => {
    getLPs();
  }, []);

  return (
    <div>
      <SectionMenu menuCurrent="Courses" />
      <div className="content">
        <div className="row">
          <LeftSideBar filter={filter} countCate={countCate} />
          <div className="col-10">
            <div className="container">
              <div className="row">
                <div className={`col-3 hi`}>
                  <p style={{ fontWeight: "700", fontSize: "20px" }}>
                    {LPs?.length || 0} Courses Found
                  </p>
                </div>
              </div>
              <CourseList
                loading={false}
                courses={filterLPs}
                checkCourse={false}
              />
            </div>
          </div>
        </div>
      </div>
      <style type="text/css">{overwriteCss}</style>
    </div>
  );
};

export default Courses;
