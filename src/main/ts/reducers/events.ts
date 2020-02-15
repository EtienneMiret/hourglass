import { EventListState, Events } from '../state/event-list';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import {
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_REQUEST,
  FETCH_EVENT_SUCCESS
} from '../actions/events';
import {
  FETCH_SINGLE_EVENT_FAILURE,
  FETCH_SINGLE_EVENT_REQUEST,
  FETCH_SINGLE_EVENT_SUCCESS
} from '../actions/event';

export function events (
    state: EventListState = {creation: null, list: {}, status: HttpStatus.None},
    action: Action
) {
  switch (action.type) {
    /* Event list actions. */
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

    /* Single event actions. */
    case FETCH_SINGLE_EVENT_REQUEST: {
      const id = action.id;
      const container = Object.assign ({}, state.list[id], {
        status: HttpStatus.Progressing
      });
      const list = Object.assign ({}, state.list, {
        [id]: container
      });
      return Object.assign ({}, state, {list});
    }
    case FETCH_SINGLE_EVENT_SUCCESS: {
      const event = action.response;
      const container = Object.assign ({}, state.list[event.id], {
        event,
        status: HttpStatus.Success
      });
      const list = Object.assign ({}, state.list, {
        [event.id]: container
      });
      return Object.assign ({}, state, {list});
    }
    case FETCH_SINGLE_EVENT_FAILURE: {
      const id = action.id;
      const container = Object.assign ({}, state.list[id], {
        status: HttpStatus.Failure
      });
      const list = Object.assign ({}, state.list, {
        [id]: container
      });
      return Object.assign ({}, state, {list});
    }

    default:
      return state;
  }
}
