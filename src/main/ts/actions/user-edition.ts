import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { patch, post } from '../http/fetch';
import { NewUser, User } from '../state/user';
import { fetchSingleUserFailure, fetchSingleUserSuccess } from './user';
import { Action } from './index';

export const EDIT_USER_START = 'EDIT_USER_START';
export const EDIT_USER_SET_NAME = 'EDIT_USER_SET_NAME';
export const EDIT_USER_ADD_EMAIL = 'EDIT_USER_ADD_EMAIL';
export const EDIT_USER_REMOVE_EMAIL = 'EDIT_USER_REMOVE_EMAIL';
export const EDIT_USER_SUBMIT = 'EDIT_USER_SUBMIT';
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

export interface EditUserFinishAction {
  type: typeof EDIT_USER_FINISH,
  id: string | null
}

export type EditUserAction = EditUserStartAction
    | EditUserSetNameAction
    | EditUserAddEmailAction
    | EditUserRemoveEmailAction
    | EditUserSubmitAction
    | EditUserFinishAction;

export function editUserStart (id: string | null): EditUserStartAction {
  return {type: EDIT_USER_START, id};
}

export function editUserSetName (id: string | null, name: string)
    : EditUserSetNameAction {
  return {type: EDIT_USER_SET_NAME, id, name};
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

export function editUserFinish (id: string | null): EditUserFinishAction {
  return {type: EDIT_USER_FINISH, id};
}

export function editUser (user: User, comment: string): ThunkAction<Promise<Action>, GlobalState, undefined, Action> {
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
