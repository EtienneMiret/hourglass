import { UserListState, Users } from '../state/user-list';
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
import { UserContainer } from '../state/user';
import { Action } from '../actions';

export function users (
    state: UserListState = {status: HttpStatus.None, list: {}},
    action: Action
): UserListState {
  switch (action.type) {
    case FETCH_USER_REQUEST: {
      return Object.assign({}, state, {
        status: HttpStatus.Progressing
      });
    }
    case FETCH_USER_SUCCESS: {
      const list = {} as Users;
      action.response
          .forEach (u => list[u.id] = {user: u, status: HttpStatus.Success});
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

    default:
      return state;
  }
}
