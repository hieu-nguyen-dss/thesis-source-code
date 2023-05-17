import React, { useState, useEffect } from "react";
import { Button, Form, Radio, Space } from "antd";
import lpApi from "../../../../apis/courses";
import { HTTP_STATUS } from "../../../../constants";
import { useAuth } from "../../../../contexts";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const Quiz = ({ kye, onFinish, quizzes, onChangeForm, values, setValues }) => {
  const auth = useAuth();
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(undefined);

  const getAnswer = async () => {
    const { status, data } = await lpApi.getAnswerQuiz(
      quizzes._id,
      auth.user.userId
    );
    if (status === HTTP_STATUS.OK) {
      const values =
        data?.result?.studentAnswers.map((sta) => {
          return {
            key: sta.questionId,
            answer: sta.answer,
            correctAnswer: sta.correctAnswer,
          };
        }) || [];
      setScore(data?.result?.score);
      setTotal(data.total);
      setValues(values);
    }
  };

  useEffect(() => {
    if (quizzes) {
      getAnswer();
    }
  }, []);

  return (
    <Form
      wrapperCol={{ span: 24 }}
      layout="vertical"
      key={kye}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item>
        {quizzes?.questions &&
          quizzes?.questions.map((question, key) => {
            const data = {
              key: question._id,
              lessonId: quizzes.id,
              question: question.questions,
              quizId: quizzes._id,
            };
            const value = values?.find((v) => v.key === question._id);
            return (
              <div className="row" key={key}>
                <div className="col-12">
                  <p>
                    Question {key + 1}: {question.questions}
                  </p>
                  <Form.Item>
                    <Radio.Group
                      onChange={(e) => onChangeForm(e, data)}
                      value={value?.answer}
                      key={key}
                      disabled={total === 3 ? true : false}
                    >
                      <Space direction="vertical">
                        {question.choices &&
                          question.choices.length &&
                          question.choices.map((ch, key) => (
                            <Radio key={key} value={ch.key}>
                              <span>{ch.value}</span>
                              {value?.answer === ch.key &&
                              value?.answer === value?.correctAnswer ? (
                                <CheckIcon
                                  sx={{
                                    width: 14,
                                    height: 14,
                                    color: "green",
                                    marginLeft: "10px",
                                  }}
                                />
                              ) : value?.answer === ch.key && score ? (
                                <CloseIcon
                                  sx={{
                                    width: 14,
                                    height: 14,
                                    color: "red",
                                    marginLeft: "10px",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </Radio>
                          ))}
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            );
          })}
      </Form.Item>
      {quizzes && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      )}
      {score && (
        <section>
          <p style={{ fontWeight: "bold" }}>Your score: {score.toFixed(2)}</p>
        </section>
      )}
    </Form>
  );
};

export default Quiz;
