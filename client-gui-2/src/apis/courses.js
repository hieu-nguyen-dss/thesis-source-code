import * as rest from "./base";

const getMyLPs = (userId) => rest.get(`/learning-paths/all?userId=${userId}`);
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
