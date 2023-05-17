import { actionTypes } from './constants'

export const initialState = {
  user: {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: ''
  },
}

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_INFO_START: {
      return {
        ...state
      }
    }
    case actionTypes.GET_USER_INFO_SUCCESS: {
      return {
        ...state,
        user: {
          ...action.payload.data.user
        },
      }
    }
    case actionTypes.GET_USER_INFO_FAIL: {
      return {
        ...state
      }
    }
    case actionTypes.UPDATE_USER_INFO_SUCCESS: {
      return {
        ...state,
        user: {
          ...action.payload.data.user
        },
      }
    }
    case actionTypes.UPDATE_USER_INFO_FAIL: {
      return {
        ...state
      }
    }

    default:
      return {
        ...state
      }
  }
}
export default profileReducer