import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Event } from '../state/event';
import { GlobalState } from '../state';
import { get } from '../http/fetch';

export const FETCH_EVENT_REQUEST = 'FETCH_EVENT_REQUEST';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';
export const FETCH_EVENT_FAILURE = 'FETCH_EVENT_FAILURE';

export interface FetchEventRequestAction extends Action {
  type: typeof FETCH_EVENT_REQUEST;
}

export interface FetchEventSuccessAction extends Action {
  type: typeof FETCH_EVENT_SUCCESS;
  response: Event[];
}

export interface FetchEventFailureAction extends Action {
  type: typeof FETCH_EVENT_FAILURE;
}

export type FetchEventAction =
  FetchEventRequestAction | FetchEventSuccessAction | FetchEventFailureAction;

export function fetchEventRequest (): FetchEventRequestAction {
  return {
    type: FETCH_EVENT_REQUEST
  };
}

export function fetchEventSuccess (response: Event[]): FetchEventSuccessAction {
  return {
    type: FETCH_EVENT_SUCCESS,
    response
  };
}

export function fetchEventFailure (): FetchEventFailureAction {
  return {
    type: FETCH_EVENT_FAILURE
  };
}

export function fetchEvents (): ThunkAction<Promise<FetchEventAction>, GlobalState, undefined, FetchEventAction> {
  return function (dispatch) {
    dispatch (fetchEventRequest());

    return get ('/events')
        .then (
            json => dispatch (fetchEventSuccess (json)),
            () => dispatch (fetchEventFailure())
        );
  }
}
