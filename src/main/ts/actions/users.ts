import { User } from '../state/user';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export interface FetchUserRequestAction extends Action {
  type: typeof FETCH_USER_REQUEST
}

export interface FetchUserSuccessAction extends Action {
  type: typeof FETCH_USER_SUCCESS,
  response: User[]
}

export interface FetchUserFailureAction extends Action {
  type: typeof FETCH_USER_FAILURE
}

export type FetchUserAction =
  FetchUserRequestAction | FetchUserSuccessAction | FetchUserFailureAction;

function fetchUserRequest (): FetchUserRequestAction {
  return {
    type: FETCH_USER_REQUEST
  };
}

function fetchUserSuccess (response: User[]): FetchUserSuccessAction {
  return {
    type: FETCH_USER_SUCCESS,
    response
  };
}

function fetchUserFailure (): FetchUserFailureAction {
  return {
    type: FETCH_USER_FAILURE
  };
}

export function fetchUsers (): ThunkAction<Promise<FetchUserAction>, GlobalState, undefined, FetchUserAction> {
  return function (dispatch) {
    dispatch (fetchUserRequest ());

    return fetch ('/users')
        .then (response => response.json ())
        .then (
            json => dispatch (fetchUserSuccess (json)),
            () => dispatch (fetchUserFailure ())
        );
  }
}
