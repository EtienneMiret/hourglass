import { HttpStatus } from './status';

export interface NewRule {
  name: string;
  points: number;
}

export interface Rule extends NewRule{
  id: string;
}

export interface RuleContainer {
  edition: Rule | null;
  rule: Rule;
  status: HttpStatus;
}
