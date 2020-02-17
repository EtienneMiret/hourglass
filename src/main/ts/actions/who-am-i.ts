import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { WhoAmI } from '../state/who-am-i';
import { GlobalState } from '../state';
import { get } from '../lib/http';

export const FETCH_WHOAMI_REQUEST = 'FETCH_WHOAMI_REQUEST';
export const FETCH_WHOAMI_SUCCESS = 'FETCH_WHOAMI_SUCCESS';
export const FETCH_WHOAMI_FAILURE = 'FETCH_WHOAMI_FAILURE';

export interface FetchWhoamiRequestAction extends Action {
  type: typeof FETCH_WHOAMI_REQUEST;
}

export interface FetchWhoamiSuccessAction extends Action {
  type: typeof FETCH_WHOAMI_SUCCESS;
  response: WhoAmI;
}

export interface FetchWhoamiFailureAction extends Action {
  type: typeof FETCH_WHOAMI_FAILURE;
}

export type FetchWhoamiAction =
  FetchWhoamiRequestAction | FetchWhoamiSuccessAction | FetchWhoamiFailureAction;

function fetchWhoamiRequest (): FetchWhoamiRequestAction {
  return {
    type: FETCH_WHOAMI_REQUEST
  };
}

function fetchWhoamiSuccess (response: WhoAmI): FetchWhoamiSuccessAction {
  return {
    type: FETCH_WHOAMI_SUCCESS,
    response
  };
}

function fetchWhoamiFailure (): FetchWhoamiFailureAction {
  return {
    type: FETCH_WHOAMI_FAILURE
  };
}

export function fetchWhoAmI (): ThunkAction<Promise<FetchWhoamiAction>, GlobalState, undefined, FetchWhoamiAction> {
  return function (dispatch) {
    dispatch (fetchWhoamiRequest ());

    return get ('/who-am-i')
        .then (
            json => dispatch (fetchWhoamiSuccess (json)),
            () => dispatch (fetchWhoamiFailure ())
        );
  }
}
