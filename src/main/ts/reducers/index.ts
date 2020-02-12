import { combineReducers } from "redux";
import { users } from './users';
import { teams } from './teams';

export const reducers = combineReducers ({
  teams,
  users
});
