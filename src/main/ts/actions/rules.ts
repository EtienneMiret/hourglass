import { Rule } from '../state/rule';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { Action } from './index';
import { get } from '../http/fetch';

export const FETCH_RULE_REQUEST = 'FETCH_RULE_REQUEST';
export const FETCH_RULE_SUCCESS = 'FETCH_RULE_SUCCESS';
export const FETCH_RULE_FAILURE = 'FETCH_RULE_FAILURE';

export interface FetchRuleRequestAction {
  type: typeof FETCH_RULE_REQUEST;
}

export interface FetchRuleSuccessAction {
  type: typeof FETCH_RULE_SUCCESS;
  response: Rule[];
}

export interface FetchRuleFailureAction {
  type: typeof FETCH_RULE_FAILURE;
}

export type FetchRuleAction =
  FetchRuleRequestAction | FetchRuleSuccessAction | FetchRuleFailureAction;

export function fetchRuleRequest (): FetchRuleRequestAction {
  return {
    type: FETCH_RULE_REQUEST
  };
}

export function fetchRuleSuccess (response: Rule[]): FetchRuleSuccessAction {
  return {
    type: FETCH_RULE_SUCCESS,
    response
  };
}

export function fetchRuleFailure (): FetchRuleFailureAction {
  return {
    type: FETCH_RULE_FAILURE
  };
}

export function fetchRules (): ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (fetchRuleRequest ());

    return get ('/rules')
        .then (
            json => dispatch (fetchRuleSuccess (json)),
            () => dispatch (fetchRuleFailure ())
        );
  }
}
