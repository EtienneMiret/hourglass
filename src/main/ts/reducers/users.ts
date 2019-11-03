import { UserListState } from '../state/user-list';
import { HttpStatus } from '../state/status';
import { FETCH_USER_FAILURE, FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FetchUserSuccessAction } from '../actions/users';
import { Action } from 'redux';

export function users (
    state: UserListState = { status: HttpStatus.None, list: []},
    action: Action
) {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return Object.assign({}, state, {
        status: HttpStatus.Progressing
      });
    case FETCH_USER_SUCCESS:
      return Object.assign ({}, state, {
        status: HttpStatus.Success,
        list: (<FetchUserSuccessAction>action).response
      });
    case FETCH_USER_FAILURE:
      return Object.assign ({}, state, {
        status: HttpStatus.Failure,
      });
    default:
      return state;
  }
}
