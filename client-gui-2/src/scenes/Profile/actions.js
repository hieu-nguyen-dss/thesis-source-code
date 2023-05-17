import { actionTypes } from "./constants"
export const getUserInfoStart = (input) => ({
    type: actionTypes.GET_USER_INFO_START,
    payload: input
})
export const getUserInfoSuccess = (output) => ({
    type: actionTypes.GET_USER_INFO_SUCCESS,
    payload: output
})
export const getUserInfoFail = () => ({
    type: actionTypes.GET_USER_INFO_FAIL
})

export const updateUserInfoStart = (input) => ({
    type: actionTypes.UPDATE_USER_INFO_START,
    payload: input
})
export const updateUserInfoSuccess = (output) => ({
    type: actionTypes.UPDATE_USER_INFO_SUCCESS,
    payload: output
})
export const updateUserInfoFail = () => ({
    type: actionTypes.UPDATE_USER_INFO_FAIL
})
