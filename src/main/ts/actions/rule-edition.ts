import { ThunkAction } from 'redux-thunk';
import { NewRule, Rule } from '../state/rule';
import { GlobalState } from '../state';
import { Action } from './index';
import { patch, post } from '../lib/http';
import { fetchSingleRuleFailure, fetchSingleRuleSuccess } from './rule';
import { fetchRuleFailure } from './rules';

export const EDIT_RULE_START = 'EDIT_RULE_START';
export const EDIT_RULE_SET_NAME = 'EDIT_RULE_SET_NAME';
export const EDIT_RULE_SET_POINTS = 'EDIT_RULE_SET_POINTS';
export const EDIT_RULE_SUBMIT = 'EDIT_RULE_SUBMIT';
export const EDIT_RULE_CREATION_SUCCESS = 'EDIT_RULE_CREATION_SUCCESS';
export const EDIT_RULE_CANCEL = 'EDIT_RULE_CANCEL';

export interface EditRuleStartAction {
  type: typeof EDIT_RULE_START;
  id: string | null;
}

export interface EditRuleSetNameAction {
  type: typeof EDIT_RULE_SET_NAME;
  id: string | null;
  name: string;
}

export interface EditRuleSetPointsAction {
  type: typeof EDIT_RULE_SET_POINTS;
  id: string | null;
  points: number;
}

export interface EditRuleSubmitAction {
  type: typeof EDIT_RULE_SUBMIT;
  id: string | null;
}

export interface EditRuleCreationSuccessAction {
  type: typeof EDIT_RULE_CREATION_SUCCESS;
}

export interface EditRuleCancelAction {
  type: typeof EDIT_RULE_CANCEL;
  id: string | null;
}

export type EditRuleAction = EditRuleStartAction
  | EditRuleSetNameAction
  | EditRuleSetPointsAction
  | EditRuleSubmitAction
  | EditRuleCreationSuccessAction
  | EditRuleCancelAction;

export function editRuleStart (id: string | null): EditRuleStartAction {
  return {type: EDIT_RULE_START, id};
}

export function editRuleSetName (id: string | null, name: string)
    : EditRuleSetNameAction {
  return {type: EDIT_RULE_SET_NAME, id, name};
}

export function editRuleSetPoints (id: string | null, points: number)
    : EditRuleSetPointsAction {
  return {type: EDIT_RULE_SET_POINTS, id, points};
}

export function editRuleSubmit (id: string | null): EditRuleSubmitAction {
  return {type: EDIT_RULE_SUBMIT, id};
}

export function editRuleCreationSuccess (): EditRuleCreationSuccessAction {
  return {type: EDIT_RULE_CREATION_SUCCESS};
}

export function editRuleCancel (id: string | null): EditRuleCancelAction {
  return {type: EDIT_RULE_CANCEL, id};
}

export function createRule (rule: NewRule, comment: string)
  : ThunkAction<Promise<any>, GlobalState, undefined, Action>  {
  return function (dispatch) {
    dispatch (editRuleSubmit (null));

    return post ('/rules', {
      comment,
      object: rule
    }).then (
        json => {
          dispatch (editRuleCreationSuccess ());
          dispatch (fetchSingleRuleSuccess (json));
        },
        () => dispatch (fetchRuleFailure ())
    );
  }
}

export function editRule (rule: Rule, comment: string)
    : ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (editRuleSubmit (rule.id));

    return patch (`/rules/${encodeURIComponent (rule.id)}`, {
      comment,
      object: rule
    }).then (
        json => dispatch (fetchSingleRuleSuccess (json)),
        () => dispatch (fetchSingleRuleFailure (rule.id))
    );
  }
}
