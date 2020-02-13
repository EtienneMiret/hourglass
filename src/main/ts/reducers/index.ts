import { combineReducers } from "redux";
import { users } from './users';
import { teams } from './teams';
import { events } from './events';

export const reducers = combineReducers ({
  teams,
  events,
  users
});
