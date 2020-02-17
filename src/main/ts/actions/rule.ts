import { Rule } from '../state/rule';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { Action } from './index';
import { get } from '../lib/http';

export const FETCH_SINGLE_RULE_REQUEST = 'FETCH_SINGLE_RULE_REQUEST';
export const FETCH_SINGLE_RULE_SUCCESS = 'FETCH_SINGLE_RULE_SUCCESS';
export const FETCH_SINGLE_RULE_FAILURE = 'FETCH_SINGLE_RULE_FAILURE';

export interface FetchSingleRuleRequestAction {
  type: typeof FETCH_SINGLE_RULE_REQUEST;
  id: string;
}

export interface FetchSingleRuleSuccessAction {
  type: typeof FETCH_SINGLE_RULE_SUCCESS;
  response: Rule;
}

export interface FetchSingleRuleFailureAction {
  type: typeof FETCH_SINGLE_RULE_FAILURE;
  id: string;
}

export type FetchSingleRuleAction = FetchSingleRuleRequestAction
    | FetchSingleRuleSuccessAction
    | FetchSingleRuleFailureAction;

export function fetchSingleRuleRequest (id: string): FetchSingleRuleRequestAction {
  return {
    type: FETCH_SINGLE_RULE_REQUEST,
    id
  };
}

export function fetchSingleRuleSuccess (response: Rule): FetchSingleRuleSuccessAction {
  return {
    type: FETCH_SINGLE_RULE_SUCCESS,
    response
  };
}

export function fetchSingleRuleFailure (id: string): FetchSingleRuleFailureAction {
  return {
    type: FETCH_SINGLE_RULE_FAILURE,
    id
  };
}

export function fetchRule (id: string): ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (fetchSingleRuleRequest (id));

    return get (`/rules/${encodeURIComponent (id)}`)
        .then (
            json => dispatch (fetchSingleRuleSuccess (json)),
            () => dispatch (fetchSingleRuleFailure (id))
        );
  }
}
