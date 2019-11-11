import { User } from '../state/user';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { get } from '../http/fetch';

export const FETCH_SINGLE_USER_REQUEST = 'FETCH_SINGLE_USER_REQUEST';
export const FETCH_SINGLE_USER_SUCCESS = 'FETCH_SINGLE_USER_SUCCESS';
export const FETCH_SINGLE_USER_FAILURE = 'FETCH_SINGLE_USER_FAILURE';

export interface FetchSingleUserRequestAction {
  type: typeof FETCH_SINGLE_USER_REQUEST,
  id: string
}

export interface FetchSingleUserSuccessAction {
  type: typeof FETCH_SINGLE_USER_SUCCESS,
  response: User
}

export interface FetchSingleUserFailureAction {
  type: typeof FETCH_SINGLE_USER_FAILURE,
  id: string
}

export type FetchSingleUserAction = FetchSingleUserRequestAction |
    FetchSingleUserSuccessAction |
    FetchSingleUserFailureAction;

export function fetchSingleUserRequest (id: string)
    : FetchSingleUserRequestAction {
  return {
    type: FETCH_SINGLE_USER_REQUEST,
    id
  };
}

export function fetchSingleUserSuccess (user: User)
    : FetchSingleUserSuccessAction {
  return {
    type: FETCH_SINGLE_USER_SUCCESS,
    response: user
  }
}

export function fetchSingleUserFailure (id: string): FetchSingleUserFailureAction {
  return {
    type: FETCH_SINGLE_USER_FAILURE,
    id
  }
}

export function fetchUser (id: string)
    : ThunkAction<Promise<FetchSingleUserAction>, GlobalState, undefined, FetchSingleUserAction> {
  return function (dispatch) {
    dispatch (fetchSingleUserRequest (id));

    return get (`/users/${encodeURIComponent (id)}`)
        .then (
            json => dispatch (fetchSingleUserSuccess (json)),
            () => dispatch (fetchSingleUserFailure (id))
        );
  }
}
