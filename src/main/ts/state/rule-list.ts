import { NewRule, RuleContainer } from './rule';
import { HttpStatus } from './status';

export interface Rules {
  [key: string]: RuleContainer;
}

export interface RuleListState {
  creation: NewRule | null;
  list: Rules;
  status: HttpStatus;
}
