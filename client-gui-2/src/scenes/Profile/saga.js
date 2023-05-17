import { takeLatest, call, race, put } from "@redux-saga/core/effects";
import { actionTypes } from "./constants";
import {
  getUserInfoSuccess,
  getUserInfoFail,
  updateUserInfoSuccess,
  updateUserInfoFail
}
  from './actions'
import service from './services'
export default function* watchProfileAction() {
  yield takeLatest(
    actionTypes.GET_USER_INFO_START,
    getUserInfo
  )
  yield takeLatest(
    actionTypes.UPDATE_USER_INFO_START,
    updateUserInfo
  )
}

function* getUserInfo(input) {
  try {
    const { output } = yield race({
      output: call(service.getUserInfo, input.payload)
    })
    if (output) {
      yield put(getUserInfoSuccess(output))
    }
    else {
      yield put(getUserInfoFail())
    }
  } catch (error) {
    yield put(getUserInfoFail())
  }
}

function* updateUserInfo(input) {
  try {
    const { output } = yield race({
      output: call(service.updateUserInfo, input.payload)
    })
    if (output) {
      yield put(updateUserInfoSuccess(output))
    }
    else {
      yield put(updateUserInfoFail())
    }
  } catch (error) {
    yield put(updateUserInfoFail())
  }
}
