import {createSelector} from 'reselect'
import { initialState } from './reducer'

const selectState = (state) => state.profileRoot || initialState

const makeSelectUser = () => createSelector(selectState, substate => substate.user)

export {
   makeSelectUser,
}
