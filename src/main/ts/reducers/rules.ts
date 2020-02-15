import { RuleListState } from '../state/rule-list';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';

export function rules (
    state: RuleListState = {creation: null, list:{}, status: HttpStatus.None},
    action: Action
) {
  return state;
}
