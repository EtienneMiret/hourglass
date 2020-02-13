import { EventListState, Events } from '../state/event-list';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import {
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_REQUEST,
  FETCH_EVENT_SUCCESS
} from '../actions/events';

export function events (
    state: EventListState = {creation: null, list: {}, status: HttpStatus.None},
    action: Action
) {
  switch (action.type) {
    case FETCH_EVENT_REQUEST:
      return Object.assign ({}, state, {
        status: HttpStatus.Progressing
      });
    case FETCH_EVENT_SUCCESS:
      const list = {} as Events;
      action.response
          .forEach (e => list[e.id] = {
            edition: null,
            event: e,
            status: HttpStatus.Success
          });
      return Object.assign ({}, state, {
        list,
        status: HttpStatus.Success
      });
    case FETCH_EVENT_FAILURE:
      return Object.assign ({}, state, {
        status: HttpStatus.Failure
      });
    default:
      return state;
  }
}
