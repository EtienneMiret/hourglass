import { RuleListState, Rules } from '../state/rule-list';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import {
  FETCH_RULE_FAILURE,
  FETCH_RULE_REQUEST,
  FETCH_RULE_SUCCESS
} from '../actions/rules';
import {
  FETCH_SINGLE_RULE_FAILURE,
  FETCH_SINGLE_RULE_REQUEST,
  FETCH_SINGLE_RULE_SUCCESS
} from '../actions/rule';

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

    /* Single rule actions. */
    case FETCH_SINGLE_RULE_REQUEST: {
      const id = action.id;
      const container = Object.assign ({}, state.list[id], {
        status: HttpStatus.Progressing
      });
      const list = Object.assign ({}, state.list, {
        [id]: container
      });
      return Object.assign ({}, state, {list});
    }
    case FETCH_SINGLE_RULE_SUCCESS: {
      const rule = action.response;
      const container = Object.assign ({}, state.list[rule.id], {
        rule,
        status: HttpStatus.Success
      });
      const list = Object.assign ({}, state.list, {
        [rule.id]: container
      });
      return Object.assign ({}, state, {list});
    }
    case FETCH_SINGLE_RULE_FAILURE: {
      const id= action.id;
      const container = Object.assign ({}, state.list[id], {
        status: HttpStatus.Failure
      });
      const list = Object.assign ({}, state.list, {
        [id]: container
      });
      return Object.assign ({}, state, {list});
    }

    default:
      return state;
  }
}
