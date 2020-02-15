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
import {
  EDIT_RULE_CANCEL,
  EDIT_RULE_CREATION_SUCCESS,
  EDIT_RULE_SET_NAME,
  EDIT_RULE_SET_POINTS,
  EDIT_RULE_START,
  EDIT_RULE_SUBMIT
} from '../actions/rule-edition';
import { NewRule } from '../state/rule';

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

    /* Rule edition actions. */
    case EDIT_RULE_START: {
      if (action.id === null) {
        const creation: NewRule = {
          name: '',
          points: 0
        };
        return Object.assign ({}, state, {creation});
      } else {
        const edition = state.list[action.id].rule;
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_RULE_SET_NAME: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const creation = Object.assign ({}, state.creation, {
          name: action.name
        });
        return Object.assign ({}, state, {creation});
      } else {
        if (state.list[action.id].edition === null) {
          return state;
        }
        const edition = Object.assign ({}, state.list[action.id].edition, {
          name: action.name
        });
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_RULE_SET_POINTS: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const creation = Object.assign ({}, state.creation, {
          points: action.points
        });
        return Object.assign ({}, state, {creation});
      } else {
        if (state.list[action.id].edition === null) {
          return state;
        }
        const edition = Object.assign ({}, state.list[action.id].edition, {
          points: action.points
        });
        const container = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_RULE_SUBMIT: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        return Object.assign ({}, state, {
          creation: null,
          status: HttpStatus.Progressing
        });
      } else {
        if (!state.list[action.id]) {
          return state;
        }
        const container = Object.assign({}, state.list[action.id], {
          edition: null,
          status: HttpStatus.Progressing
        });
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_RULE_CREATION_SUCCESS: {
      return Object.assign ({}, state, {status: HttpStatus.Success});
    }
    case EDIT_RULE_CANCEL: {
      if (action.id === null) {
        return Object.assign ({}, state, {creation: null});
      } else {
        if (!state.list[action.id]) {
          return state;
        }
        const container = Object.assign ({}, state.list[action.id], {
          edition: null
        });
        const list = Object.assign ({}, state.list, {
          [action.id]: container
        });
        return Object.assign ({}, state, {list});
      }
    }

    default:
      return state;
  }
}
