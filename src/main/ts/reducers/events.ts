import { EventCreation, EventListState, Events } from '../state/event-list';
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
import {
  EDIT_EVENT_ADD_USER,
  EDIT_EVENT_CANCEL,
  EDIT_EVENT_CREATION_SUCCESS,
  EDIT_EVENT_REMOVE_USER,
  EDIT_EVENT_SET_DATE,
  EDIT_EVENT_SET_NAME,
  EDIT_EVENT_SET_RULE,
  EDIT_EVENT_START,
  EDIT_EVENT_SUBMIT
} from '../actions/event-edition';
import { EventContainer, NewEvent } from '../state/event';

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

    /* Edit event actions. */
    case EDIT_EVENT_START: {
      if (action.id === null) {
        const event: NewEvent = {
          name: '',
          date: '',
          scaleRuleId: '',
          userIds: []
        };
        const creation: EventCreation = {event, status: HttpStatus.None};
        return Object.assign ({}, state, {creation});
      } else {
        if (!state.list[action.id]) {
          return state;
        }
        const edition = state.list[action.id].event;
        const container =
            Object.assign({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_EVENT_SET_NAME: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const event = Object.assign ({}, state.creation.event, {
          name: action.name
        });
        const creation = Object.assign ({}, state.creation, {event});
        return Object.assign ({}, state, {creation});
      } else {
        if (!state.list[action.id] || !state.list[action.id].edition) {
          return state;
        }
        const edition = Object.assign ({}, state.list[action.id].edition, {
          name: action.name
        });
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_EVENT_SET_DATE: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const event = Object.assign ({}, state.creation.event, {
          date: action.date
        });
        const creation = Object.assign ({}, state.creation, {event});
        return Object.assign ({}, state, {creation});
      } else {
        if (!state.list[action.id] || !state.list[action.id].edition) {
          return state;
        }
        const edition = Object.assign ({}, state.list[action.id].edition, {
          date: action.date
        });
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_EVENT_SET_RULE: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const event = Object.assign ({}, state.creation.event, {
          scaleRuleId: action.scaleRuleId
        });
        const creation = Object.assign ({}, state.creation, {event});
        return Object.assign ({}, state, {creation});
      } else {
        if (!state.list[action.id] || !state.list[action.id].edition) {
          return state;
        }
        const edition = Object.assign ({}, state.list[action.id].edition, {
          scaleRuleId: action.scaleRuleId
        });
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_EVENT_ADD_USER: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        if (state.creation.event.userIds.includes (action.userId)) {
          return state;
        }
        const userIds = state.creation.event.userIds.slice ();
        userIds.push (action.userId);
        const event = Object.assign ({}, state.creation.event, {userIds});
        const creation = Object.assign ({}, state.creation, {event});
        return Object.assign ({}, state, {creation});
      } else {
        if (!state.list[action.id]) {
          return state;
        }
        const originalEdition = state.list[action.id].edition;
        if (!originalEdition) {
          return state;
        }
        if (originalEdition.userIds.includes (action.userId)) {
          return state;
        }
        const userIds = originalEdition.userIds.slice ();
        userIds.push (action.userId);
        const edition = Object.assign ({}, originalEdition, {userIds});
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_EVENT_REMOVE_USER: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const index = state.creation.event.userIds.indexOf (action.userId);
        if (index < 0) {
          return state;
        }
        const userIds = state.creation.event.userIds.slice ();
        userIds.splice (index, 1);
        const event = Object.assign ({}, state.creation.event, {userIds});
        const creation = Object.assign ({}, state.creation, {event});
        return Object.assign ({}, state, {creation});
      } else {
        if (!state.list[action.id]) {
          return state;
        }
        const originalEdition = state.list[action.id].edition;
        if (!originalEdition) {
          return state;
        }
        const index = originalEdition.userIds.indexOf (action.userId);
        if (index < 0) {
          return state;
        }
        const userIds = originalEdition.userIds.slice ();
        userIds.splice (index, 1);
        const edition = Object.assign ({}, originalEdition, {userIds});
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_EVENT_SUBMIT: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        return Object.assign ({}, state, {
          creation: null,
          status: HttpStatus.Progressing
        });
      } else {
        if (!state.list[action.id] || !state.list[action.id].edition) {
          return state;
        }
        const container = Object.assign ({}, state.list[action.id], {
          edition: null,
          status: HttpStatus.Progressing
        });
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_EVENT_CREATION_SUCCESS: {
      const event = action.response;
      const container: EventContainer = {
        edition: null,
        event,
        status: HttpStatus.Success
      };
      const list = Object.assign ({}, state.list, {
        [event.id]: container
      });
      return Object.assign ({}, state, {list, status: HttpStatus.Success});
    }
    case EDIT_EVENT_CANCEL: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        return Object.assign ({}, state, {creation: null});
      } else {
        if (!state.list[action.id] || !state.list[action.id].edition) {
          return state;
        }
        const container = Object.assign ({}, state.list[action.id], {
          edition: null
        });
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }

    default:
      return state;
  }
}
