import axios from 'axios'
const profileApi = {}

profileApi.getUserInfo = async (input) => {
  try {
    let result = []
    result = await axios({
      method: 'post',
      url: "http://localhost:3002/api/v1/user",
      headers: {},
      data: {
        token: input
      }
    });
    return result;
  } catch (error) {
    return error
  }
}

profileApi.updateUserInfo = async (input) => {
  try {
    let result = []
    result = await axios({
      method: 'post',
      url: "http://localhost:3002/api/v1/user/update",
      headers: {},
      data: {
        ...input
      }
    });
    return result;
  } catch (error) {
    return error
  }
}


export default profileApi;