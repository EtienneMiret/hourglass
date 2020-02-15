import { RuleListState, Rules } from '../state/rule-list';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import {
  FETCH_RULE_FAILURE,
  FETCH_RULE_REQUEST,
  FETCH_RULE_SUCCESS
} from '../actions/rules';

export function rules (
    state: RuleListState = {creation: null, list:{}, status: HttpStatus.None},
    action: Action
) {
  switch (action.type) {
    /* Rule list actions. */
    case FETCH_RULE_REQUEST: {
      return Object.assign ({}, state, {
        status: HttpStatus.Progressing
      });
    }
    case FETCH_RULE_SUCCESS: {
      const list = {} as Rules;
      action.response
          .forEach (rule => list[rule.id] = {
            edition: null,
            rule,
            status: HttpStatus.Success
          });
      return Object.assign ({}, state, {
        list,
        status: HttpStatus.Success
      });
    }
    case FETCH_RULE_FAILURE: {
      return Object.assign ({}, state, {
        status: HttpStatus.Failure
      });
    }

    default:
      return state;
  }
}
