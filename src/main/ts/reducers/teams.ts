import { TeamListState, Teams } from '../state/team-list';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import {
  FETCH_TEAM_FAILURE,
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS
} from '../actions/teams';
import {
  FETCH_SINGLE_TEAM_FAILURE,
  FETCH_SINGLE_TEAM_REQUEST,
  FETCH_SINGLE_TEAM_SUCCESS
} from '../actions/team';

export function teams (
    state: TeamListState = {creation: null, list: {}, status: HttpStatus.None},
    action: Action
) {
  switch (action.type) {
    /* Team list actions. */
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

    /* Single team actions. */
    case FETCH_SINGLE_TEAM_REQUEST: {
      const id = action.id;
      const teamContainer = Object.assign ({}, state.list[id], {
        status: HttpStatus.Progressing
      });
      const list = Object.assign ({}, state.list, {
        [id]: teamContainer
      });
      return Object.assign ({}, state, {list});
    }
    case FETCH_SINGLE_TEAM_SUCCESS: {
      const team = action.response;
      const teamContainer = Object.assign ({}, state.list[team.id], {
        team,
        status: HttpStatus.Success
      });
      const list = Object.assign ({}, state.list, {
        [team.id]: teamContainer
      });
      return Object.assign ({}, state, {list});
    }
    case FETCH_SINGLE_TEAM_FAILURE: {
      const id = action.id;
      const teamContainer = Object.assign ({}, state.list[id], {
        status: HttpStatus.Failure
      });
      const list = Object.assign ({}, state.list, {
        [id]: teamContainer
      });
      return Object.assign ({}, state, {list});
    }

    default:
      return state;
  }
}
