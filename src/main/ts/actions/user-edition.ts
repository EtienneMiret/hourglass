import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { patch, post } from '../http/fetch';
import { NewUser, User } from '../state/user';
import { fetchSingleUserFailure, fetchSingleUserSuccess } from './user';
import { Action } from './index';
import { fetchUserFailure } from './users';

export const EDIT_USER_START = 'EDIT_USER_START';
export const EDIT_USER_SET_NAME = 'EDIT_USER_SET_NAME';
export const EDIT_USER_SET_TEAM = 'EDIT_USER_SET_TEAM';
export const EDIT_USER_ADD_EMAIL = 'EDIT_USER_ADD_EMAIL';
export const EDIT_USER_REMOVE_EMAIL = 'EDIT_USER_REMOVE_EMAIL';
export const EDIT_USER_SUBMIT = 'EDIT_USER_SUBMIT';
export const EDIT_USER_CREATION_SUCCESS = 'EDIT_USER_CREATION_SUCCESS';
export const EDIT_USER_FINISH = 'EDIT_USER_FINISH';

export interface EditUserStartAction {
  type: typeof EDIT_USER_START,
  id: string | null
}

export interface EditUserSetNameAction {
  type: typeof EDIT_USER_SET_NAME,
  id: string | null,
  name: string
}

export interface EditUserSetTeamAction {
  type: typeof EDIT_USER_SET_TEAM;
  id: string | null;
  teamId: string;
}

export interface EditUserAddEmailAction {
  type: typeof EDIT_USER_ADD_EMAIL,
  id: string | null,
  email: string
}

export interface EditUserRemoveEmailAction {
  type: typeof EDIT_USER_REMOVE_EMAIL,
  id: string | null,
  email: string
}

export interface EditUserSubmitAction {
  type: typeof EDIT_USER_SUBMIT,
  id: string | null
}

export interface EditUserCreationSuccess {
  type: typeof EDIT_USER_CREATION_SUCCESS
}

export interface EditUserFinishAction {
  type: typeof EDIT_USER_FINISH,
  id: string | null
}

export type EditUserAction = EditUserStartAction
    | EditUserSetNameAction
    | EditUserSetTeamAction
    | EditUserAddEmailAction
    | EditUserRemoveEmailAction
    | EditUserSubmitAction
    | EditUserCreationSuccess
    | EditUserFinishAction;

export function editUserStart (id: string | null): EditUserStartAction {
  return {type: EDIT_USER_START, id};
}

export function editUserSetName (id: string | null, name: string)
    : EditUserSetNameAction {
  return {type: EDIT_USER_SET_NAME, id, name};
}

export function editUserSetTeam (id: string | null, teamId: string)
    : EditUserSetTeamAction {
  return {type: EDIT_USER_SET_TEAM, id, teamId};
}

export function editUserAddEmail (id: string | null, email: string)
    : EditUserAddEmailAction {
  return {type: EDIT_USER_ADD_EMAIL, id, email};
}

export function editUserRemoveEmail (id: string | null, email: string)
    : EditUserRemoveEmailAction {
  return {type: EDIT_USER_REMOVE_EMAIL, id, email};
}

export function editUserSubmit (id: string | null): EditUserSubmitAction {
  return {type: EDIT_USER_SUBMIT, id};
}

export function editUserCreationSuccess (): EditUserCreationSuccess {
  return {type: EDIT_USER_CREATION_SUCCESS};
}

export function editUserFinish (id: string | null): EditUserFinishAction {
  return {type: EDIT_USER_FINISH, id};
}

export function createUser (user: NewUser, comment: string): ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (editUserSubmit (null));

    return post ('/users', {
      comment,
      object: user
    }).then (
        json => {
          dispatch (editUserCreationSuccess ());
          dispatch (fetchSingleUserSuccess (json));
        },
        () => dispatch (fetchUserFailure ())
    );
  }
}

export function editUser (user: User, comment: string): ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (editUserSubmit (user.id));

    return patch (`/users/${user.id}`, {
      comment,
      object: user
    }).then (
        json => dispatch (fetchSingleUserSuccess (json)),
        () => dispatch (fetchSingleUserFailure (user.id))
    );
  }
}
