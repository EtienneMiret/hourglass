import { UserCreation, UserListState, Users } from '../state/user-list';
import { HttpStatus } from '../state/status';
import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS
} from '../actions/users';
import {
  FETCH_SINGLE_USER_FAILURE,
  FETCH_SINGLE_USER_REQUEST,
  FETCH_SINGLE_USER_SUCCESS
} from '../actions/user';
import { NewUser, User, UserContainer } from '../state/user';
import { Action } from '../actions';
import {
  EDIT_USER_ADD_EMAIL,
  EDIT_USER_FINISH,
  EDIT_USER_REMOVE_EMAIL,
  EDIT_USER_SET_NAME,
  EDIT_USER_START,
  EDIT_USER_SUBMIT
} from '../actions/user-edition';

export function users (
    state: UserListState = {status: HttpStatus.None, list: {}, creation: null},
    action: Action
): UserListState {
  switch (action.type) {
    /* User list actions. */
    case FETCH_USER_REQUEST: {
      return Object.assign({}, state, {
        status: HttpStatus.Progressing
      });
    }
    case FETCH_USER_SUCCESS: {
      const list = {} as Users;
      action.response
          .forEach (u => list[u.id] = {
            edition: null,
            user: u,
            status: HttpStatus.Success
          });
      return Object.assign ({}, state, {
        status: HttpStatus.Success,
        list
      });
    }
    case FETCH_USER_FAILURE: {
      return Object.assign ({}, state, {
        status: HttpStatus.Failure,
      });
    }

    /* Single user actions. */
    case FETCH_SINGLE_USER_REQUEST: {
      const id = action.id;
      const userContainer = Object.assign ({}, state.list[id], {
        status: HttpStatus.Progressing
      });
      const list = Object.assign ({}, state.list, {
        [id]: userContainer
      });
      return Object.assign ({}, state, {
        list
      });
    }
    case FETCH_SINGLE_USER_SUCCESS: {
      const user = action.response;
      const userContainer: UserContainer =
          Object.assign ({}, state.list[user.id], {
            user,
            status: HttpStatus.Success
          });
      const list: Users = Object.assign ({}, state.list, {
        [user.id]: userContainer
      });
      return Object.assign ({}, state, {
        list
      });
    }
    case FETCH_SINGLE_USER_FAILURE: {
      const id = action.id;
      const userContainer: UserContainer =
          Object.assign ({}, state.list[id], {
            status: HttpStatus.Failure
          });
      const list: Users = Object.assign ({}, state.list, {
        [id]: userContainer
      });
      return Object.assign ({}, state, {
        list
      });
    }

    /* User edition actions. */
    case EDIT_USER_START: {
      if (action.id === null) {
        const user: NewUser = {
          name: '',
          teamId: '',
          emails: []
        };
        return Object.assign ({}, state, {
          creation: {user, status: HttpStatus.None}
        });
      } else {
        const edition = state.list[action.id].user;
        const userContainer: UserContainer =
            Object.assign ({}, state.list[action.id], {
              edition
            });
        const list: Users = Object.assign ({}, state.list, {
          [action.id]: userContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_USER_SET_NAME: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const user = Object.assign ({}, state.creation.user, {
          name: action.name
        });
        const creation = Object.assign ({}, state.creation, {user});
        return Object.assign ({}, state, {creation});
      } else {
        const originalEdition = state.list[action.id].edition;
        if (originalEdition === null) {
          return state;
        }
        const edition: User = Object.assign ({}, originalEdition, {
          name: action.name
        });
        const userContainer: UserContainer =
            Object.assign ({}, state.list[action.id], {edition});
        const list: Users = Object.assign ({}, state.list, {
          [action.id]: userContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_USER_ADD_EMAIL: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        if (state.creation.user.emails.includes(action.email)) {
          return state;
        }
        const emails = state.creation.user.emails.slice ();
        emails.push (action.email);
        const user: NewUser =
            Object.assign ({}, state.creation.user, {emails});
        const creation: UserCreation =
            Object.assign ({}, state.creation, {user});
        return Object.assign ({}, state, {creation});
      } else {
        const originalEdition = state.list[action.id].edition;
        if (originalEdition === null) {
          return state;
        }
        if (originalEdition.emails.includes(action.email)) {
          return state;
        }
        const emails = originalEdition.emails.slice ();
        emails.push (action.email);
        const edition: User = Object.assign ({}, originalEdition, {emails});
        const userContainer: UserContainer =
            Object.assign ({}, state.list[action.id], {edition});
        const list: Users = Object.assign ({}, state.list, {
          [action.id]: userContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_USER_REMOVE_EMAIL: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const index = state.creation.user.emails.indexOf (action.email);
        if (index < 0) {
          return state;
        }
        const emails = state.creation.user.emails.slice ();
        emails.splice (index, 1);
        const user: NewUser =
            Object.assign ({}, state.creation.user, {emails});
        const creation: UserCreation =
            Object.assign ({}, state.creation, {user});
        return Object.assign ({}, state, {creation});
      } else {
        const originalEdition = state.list[action.id].edition;
        if (originalEdition === null) {
          return state;
        }
        const index = originalEdition.emails.indexOf (action.email);
        if (index < 0) {
          return state;
        }
        const emails = originalEdition.emails.slice ();
        emails.splice (index, 1);
        const edition: User = Object.assign ({}, originalEdition, {emails});
        const userContainer: UserContainer =
            Object.assign ({}, state.list[action.id], {edition});
        const list: Users = Object.assign ({}, state.list, {
          [action.id]: userContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_USER_SUBMIT: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        return Object.assign ({}, state, {
          creation: null,
          status: HttpStatus.Progressing
        });
      } else {
        const userContainer: UserContainer = Object.assign ({}, state.list[action.id], {
          edition: null,
          status: HttpStatus.Progressing
        });
        const list: Users = Object.assign ({}, state.list, {
          [action.id]: userContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_USER_FINISH: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        return Object.assign ({}, state, {creation: null});
      } else {
        if (state.list[action.id].edition === null) {
          return state;
        }
        const userContainer: UserContainer = Object.assign ({}, state.list[action.id], {
          edition: null
        });
        const list: Users = Object.assign ({}, state.list, {
          [action.id]: userContainer
        });
        return Object.assign ({}, state, {list});
      }
    }

    default:
      return state;
  }
}
