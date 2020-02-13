import { combineReducers } from "redux";
import { users } from './users';
import { teams } from './teams';
import { events } from './events';
import { whoami } from './who-am-i';

export const reducers = combineReducers ({
  whoami,
  teams,
  events,
  users
});
