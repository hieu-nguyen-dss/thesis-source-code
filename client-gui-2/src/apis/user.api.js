import * as rest from "./base";

const userLogin = (data) => rest.post("/users/login", data);

const userSignup = (data) => rest.post("/users/signup", data);

export default {
  userLogin,
  userSignup,
};
