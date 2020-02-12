import { TeamListState, Teams } from '../state/team-list';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import {
  FETCH_TEAM_FAILURE,
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS
} from '../actions/teams';

export function teams (
    state: TeamListState = {creation: null, list: {}, status: HttpStatus.None},
    action: Action
) {
  switch (action.type) {
    case FETCH_TEAM_REQUEST:
      return Object.assign ({}, state, {
        status: HttpStatus.Progressing
      });
    case FETCH_TEAM_SUCCESS:
      const list = {} as Teams;
      action.response
          .forEach (t => list[t.id] = {
            edition: null,
            team: t,
            status: HttpStatus.Success
          });
      return Object.assign ({}, state, {
        list,
        status: HttpStatus.Success
      });
    case FETCH_TEAM_FAILURE:
      return Object.assign ({}, state, {
        status: HttpStatus.Failure
      });
    default:
      return state;
  }
}
