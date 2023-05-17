import React, { useEffect, useState } from "react";
import SectionMenu from "../../../../components/SectionMenu";
import { useAuth, useSnackbar } from "../../../../contexts";
import { Collapse } from "antd";
import { Tabs } from "antd";
import styled from "styled-components";
import lpApi from "../../../../apis/courses";
import { saveAs } from "file-saver";
import { HTTP_STATUS, SNACKBAR } from "../../../../constants";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import vars from "../../../../config/vars";
import Quiz from "./Quiz";
import GroupActivity from "./GroupActivity";

const { TabPane } = Tabs;
const { Panel } = Collapse;

const Container = styled.section`
  padding: 50px 0px;
  width: 95%;
  margin: 0 auto;
  height: 100vh;
`;
const Content = styled.div`
  display: flex;
  justify-content: flex-start,
  align-items: center
`;
const CourseDetail = () => {
  let { id } = useParams();
  const auth = useAuth();
  const [course, setCourse] = useState({});
  const [lessons, setLessons] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [values, setValues] = useState([]);
  const { openSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onChangeForm = (e, data) => {
    let value_ = [];
    if (values.length !== 0) {
      values.forEach((v) => {
        if (v.question === data.question) {
          v.answer = e.target.value;
          value_ = [...values];
        } else {
          value_ = [
            ...values,
            { ...data, key: data.key, answer: e.target.value },
          ];
        }
      });
    } else {
      value_ = [...values, { ...data, key: data.key, answer: e.target.value }];
    }
    setValues(value_);
  };

  const getCourseDetail = async (id) => {
    const { status, data } = await lpApi.getLPDetail(id);

    if (status === HTTP_STATUS.OK) {
      setCourse(data);
      setLessons(data.parts);
    }
  };

  const download = (lessonId, filename) => {
    saveAs(`${vars.server}/resources/${lessonId}/${filename}`, filename);
  };

  useEffect(() => {
    if (id !== null) {
      getCourseDetail(id);
    }
  }, []);

  const onFinish = async () => {
    const studentAnswers = values.map((v) => {
      return {
        questionId: v.key,
        answer: v.answer,
      };
    });

    const quizId = values[0]?.quizId;
    try {
      const { status, data } = await lpApi.postAnswerQuiz(
        quizId,
        auth.user.userId,
        {
          studentAnswers,
        }
      );
      if (status === HTTP_STATUS.OK) {
        openSnackbar(SNACKBAR.SUCCESS, "Submit successfully");
        setAnswer(data.answer);
        window.location.reload();
      } else {
        openSnackbar(SNACKBAR.WARNING, "Submit failed");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Try again");
    }
  };

  const onChangeTabs = (activeKey) => {
    if (activeKey === "1") {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("tab", "lesson");
      const newSearch = queryParams.toString();
      navigate({
        pathname: location.pathname,
        search: newSearch,
      });
    }
    if (activeKey === "2") {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("tab", "group-chat-room");
      const newSearch = queryParams.toString();
      navigate({
        pathname: location.pathname,
        search: newSearch,
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log("queryParams: ", queryParams.get("tab"));
    if (queryParams.get("tab") === "group-chat-room") {
      setActiveTab("2");
    }
    if (queryParams.get("tab") === "lesson") {
      setActiveTab("1");
    }
    setLoading(true);
  }, [activeTab, loading, location.search]);

  return (
    <div>
      <SectionMenu menuCurrent={`Course / ${course.name}`} />
      <Container>
        {loading && (
          <Tabs
            defaultActiveKey={activeTab}
            onChange={(activeKey) => {
              onChangeTabs(activeKey);
            }}
          >
            <TabPane tab="Lessons" key="1">
              <Container>
                <div className="row">
                  <div className="col-9">
                    <Collapse defaultActiveKey={["1"]}>
                      {lessons &&
                        lessons.length &&
                        lessons.map((le, key) => {
                          return (
                            <Panel header={`${le.name}`} key={key + 1}>
                              <Content>
                                <div className="row" style={{ width: "100%" }}>
                                  <div className="col-12">
                                    <Collapse defaultActiveKey={["1"]}>
                                      {le.lessons &&
                                        le.lessons.length &&
                                        le.lessons.map((l, key) => {
                                          return (
                                            <Panel
                                              header={`Lesson ${key + 1}: ${
                                                l.name
                                              }`}
                                              key={key + 1}
                                            >
                                              <Tabs>
                                                <TabPane
                                                  tab="Materials"
                                                  key={key}
                                                >
                                                  {(l.resources &&
                                                    l.resources.length &&
                                                    l.resources.map(
                                                      (pdf, key) => {
                                                        return pdf.type ===
                                                          "application/pdf" ? (
                                                          <div
                                                            className="row"
                                                            key={key}
                                                          >
                                                            <div className="col-12 mb-2">
                                                              <Content>
                                                                {
                                                                  <img
                                                                    width={30}
                                                                    height={25}
                                                                    src="../assets/image/slides-icon.png"
                                                                    alt={`slide for lesson ${
                                                                      key + 1
                                                                    }`}
                                                                  />
                                                                }
                                                                <div
                                                                  onClick={() =>
                                                                    download(
                                                                      l._id,
                                                                      pdf.name
                                                                    )
                                                                  }
                                                                >
                                                                  {pdf.name}
                                                                </div>
                                                              </Content>
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <div
                                                            className="row"
                                                            key={key}
                                                          >
                                                            <div className="col-4 mb-2">
                                                              <Content>
                                                                <video
                                                                  width="500"
                                                                  height="400"
                                                                  controls
                                                                  loop
                                                                >
                                                                  <source
                                                                    src={`${vars.server}/resources/${l._id}/${pdf.name}`}
                                                                    type="video/mp4"
                                                                  />
                                                                </video>
                                                              </Content>
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    )) ||
                                                    undefined}
                                                </TabPane>
                                                <TabPane tab="Quiz" key="1.2">
                                                  <Quiz
                                                    kye={key}
                                                    onFinish={onFinish}
                                                    onChangeForm={onChangeForm}
                                                    values={values}
                                                    quizzes={l.quiz[0]}
                                                    setValues={setValues}
                                                  />
                                                </TabPane>
                                              </Tabs>
                                            </Panel>
                                          );
                                        })}
                                    </Collapse>
                                  </div>
                                </div>
                              </Content>
                            </Panel>
                          );
                        })}
                    </Collapse>
                  </div>
                </div>
              </Container>
            </TabPane>
            <TabPane tab="Group Acitivity" key="2">
              <GroupActivity />
            </TabPane>
          </Tabs>
        )}
      </Container>
    </div>
  );
};

export default CourseDetail;
