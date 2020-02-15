import { combineReducers } from "redux";
import { users } from './users';
import { teams } from './teams';
import { events } from './events';
import { whoami } from './who-am-i';
import { rules } from './rules';

export const reducers = combineReducers ({
  whoami,
  teams,
  rules,
  events,
  users
});
