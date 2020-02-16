import { Event, NewEvent } from '../state/event';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { Action } from './index';
import { patch, post } from '../http/fetch';
import { fetchEventFailure } from './events';
import { fetchSingleEventFailure, fetchSingleEventSuccess } from './event';

export const EDIT_EVENT_START = 'EDIT_EVENT_START';
export const EDIT_EVENT_SET_NAME = 'EDIT_EVENT_SET_NAME';
export const EDIT_EVENT_SET_DATE = 'EDIT_EVENT_SET_DATE';
export const EDIT_EVENT_SET_RULE = 'EDIT_EVENT_SET_RULE';
export const EDIT_EVENT_ADD_USER = 'EDIT_EVENT_ADD_USER';
export const EDIT_EVENT_REMOVE_USER = 'EDIT_EVENT_REMOVE_USER';
export const EDIT_EVENT_SUBMIT = 'EDIT_EVENT_SUBMIT';
export const EDIT_EVENT_CREATION_SUCCESS = 'EDIT_EVENT_CREATION_SUCCESS';
export const EDIT_EVENT_CANCEL = 'EDIT_EVENT_CANCEL';

export interface EditEventStartAction {
  type: typeof EDIT_EVENT_START;
  id: string | null;
}

export interface EditEventSetNameAction {
  type: typeof EDIT_EVENT_SET_NAME;
  id: string | null;
  name: string;
}

export interface EditEventSetDateAction {
  type: typeof EDIT_EVENT_SET_DATE;
  id: string | null;
  date: string;
}

export interface EditEventSetRuleAction {
  type: typeof EDIT_EVENT_SET_RULE;
  id: string | null;
  scaleRuleId: string;
}

export interface EditEventAddUserAction {
  type: typeof EDIT_EVENT_ADD_USER;
  id: string | null;
  userId: string;
}

export interface EditEventRemoveUserAction {
  type: typeof EDIT_EVENT_REMOVE_USER;
  id: string | null;
  userId: string;
}

export interface EditEventSubmitAction {
  type: typeof EDIT_EVENT_SUBMIT;
  id: string | null;
}

export interface EditEventCreationSuccessAction {
  type: typeof EDIT_EVENT_CREATION_SUCCESS;
  response: Event;
}

export interface EditEventCancelAction {
  type: typeof EDIT_EVENT_CANCEL;
  id: string | null;
}

export type EditEventAction = EditEventStartAction
  | EditEventSetNameAction
  | EditEventSetDateAction
  | EditEventSetRuleAction
  | EditEventAddUserAction
  | EditEventRemoveUserAction
  | EditEventSubmitAction
  | EditEventCreationSuccessAction
  | EditEventCancelAction;

export function editEventStart (id: string | null): EditEventStartAction {
  return {type: EDIT_EVENT_START, id};
}

export function editEventSetName (id: string | null, name: string)
    : EditEventSetNameAction {
  return {type: EDIT_EVENT_SET_NAME, id, name};
}

export function editEventSetDate (id: string | null, date: string)
    : EditEventSetDateAction {
  return {type: EDIT_EVENT_SET_DATE, id, date};
}

export function editEventSetRule (id: string | null, scaleRuleId: string)
    : EditEventSetRuleAction {
  return {type: EDIT_EVENT_SET_RULE, id, scaleRuleId};
}

export function editEventAddUser (id: string | null, userId: string)
    : EditEventAddUserAction {
  return {type: EDIT_EVENT_ADD_USER, id, userId};
}

export function editEventRemoveUser (id: string | null, userId: string)
    : EditEventRemoveUserAction {
  return {type: EDIT_EVENT_REMOVE_USER, id, userId};
}

export function editEventSubmit (id: string | null): EditEventSubmitAction {
  return {type: EDIT_EVENT_SUBMIT, id};
}

export function editEventCreationSuccess (response: Event)
    : EditEventCreationSuccessAction {
  return {type: EDIT_EVENT_CREATION_SUCCESS, response};
}

export function editEventCancel (id: string | null)
    : EditEventCancelAction {
  return {type: EDIT_EVENT_CANCEL, id};
}

export function creatEvent (event: NewEvent, comment: string)
    : ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (editEventSubmit (null));

    return post ('/events', {
      comment,
      object: event
    }).then (
        json => dispatch (editEventCreationSuccess (json)),
        () => dispatch (fetchEventFailure ())
    );
  }
}

export function editEvent (event: Event, comment: string)
    : ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (editEventSubmit (event.id));

    return patch (`/events/${encodeURIComponent (event.id)}`, {
      comment,
      object: event
    }).then (
        json => dispatch (fetchSingleEventSuccess (json)),
        () => dispatch (fetchSingleEventFailure (event.id))
    );
  }
}
