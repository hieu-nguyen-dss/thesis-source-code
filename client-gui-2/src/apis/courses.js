import * as rest from "./base";

const getMyLPs = () => rest.get("/learning-paths/all");
const getLPDetail = (id) => rest.get(`/learning-paths/${id}`);

const postAnswerQuiz = (quizId, studentId, data) =>
  rest.post(`/quiz/answer/${quizId}/${studentId}`, data);
const getAnswerQuiz = (quizId, studentId) =>
  rest.get(`/quiz/answer/${quizId}/${studentId}`);
export default {
  getMyLPs,
  getLPDetail,
  postAnswerQuiz,
  getAnswerQuiz,
};
