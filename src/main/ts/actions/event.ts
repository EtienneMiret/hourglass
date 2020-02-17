import {Event} from '../state/event';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { Action } from './index';
import { get } from '../lib/http';

export const FETCH_SINGLE_EVENT_REQUEST = 'FETCH_SINGLE_EVENT_REQUEST';
export const FETCH_SINGLE_EVENT_SUCCESS = 'FETCH_SINGLE_EVENT_SUCCESS';
export const FETCH_SINGLE_EVENT_FAILURE = 'FETCH_SINGLE_EVENT_FAILURE';

export interface FetchSingleEventRequestAction {
  type: typeof FETCH_SINGLE_EVENT_REQUEST;
  id: string;
}

export interface FetchSingleEventSuccessAction {
  type: typeof FETCH_SINGLE_EVENT_SUCCESS;
  response: Event;
}

export interface FetchSingleEventFailureAction {
  type: typeof FETCH_SINGLE_EVENT_FAILURE;
  id: string;
}

export type FetchSingleEventAction = FetchSingleEventRequestAction
  | FetchSingleEventSuccessAction
  | FetchSingleEventFailureAction;

export function fetchSingleEventRequest (id: string)
    : FetchSingleEventRequestAction {
  return {
    type: FETCH_SINGLE_EVENT_REQUEST,
    id
  };
}

export function fetchSingleEventSuccess (event: Event)
    : FetchSingleEventSuccessAction {
  return {
    type: FETCH_SINGLE_EVENT_SUCCESS,
    response: event
  };
}

export function fetchSingleEventFailure (id: string)
    : FetchSingleEventFailureAction {
  return {
    type: FETCH_SINGLE_EVENT_FAILURE,
    id
  };
}

export function fetchEvent (id: string)
    : ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (fetchSingleEventRequest (id));

    return get (`/events/${encodeURIComponent (id)}`)
        .then (
            json => dispatch (fetchSingleEventSuccess (json)),
            () => dispatch (fetchSingleEventFailure (id))
        );
  }
}
