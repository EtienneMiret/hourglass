import { Team } from '../state/team';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { get } from '../lib/http';

export const FETCH_SINGLE_TEAM_REQUEST = 'FETCH_SINGLE_TEAM_REQUEST';
export const FETCH_SINGLE_TEAM_SUCCESS = 'FETCH_SINGLE_TEAM_SUCCESS';
export const FETCH_SINGLE_TEAM_FAILURE = 'FETCH_SINGLE_TEAM_FAILURE';

export interface FetchSingleTeamRequestAction {
  type: typeof FETCH_SINGLE_TEAM_REQUEST;
  id: string;
}

export interface FetchSingleTeamSuccessAction {
  type: typeof FETCH_SINGLE_TEAM_SUCCESS;
  response: Team;
}

export interface FetchSingleTeamFailureAction {
  type: typeof FETCH_SINGLE_TEAM_FAILURE;
  id: string;
}

export type FetchSingleTeamAction = FetchSingleTeamRequestAction
  | FetchSingleTeamSuccessAction
  | FetchSingleTeamFailureAction;

export function fetchSingleTeamRequest (id: string): FetchSingleTeamRequestAction {
  return {type: FETCH_SINGLE_TEAM_REQUEST, id};
}

export function fetchSingleTeamSuccess (team: Team): FetchSingleTeamSuccessAction {
  return {type: FETCH_SINGLE_TEAM_SUCCESS, response: team};
}

export function fetchSingleTeamFailure (id: string): FetchSingleTeamFailureAction {
  return {type: FETCH_SINGLE_TEAM_FAILURE, id};
}

export function fetchTeam (id: string): ThunkAction<Promise<any>, GlobalState, undefined, FetchSingleTeamAction> {
  return function (dispatch) {
    dispatch (fetchSingleTeamRequest (id));

    return get (`/teams/${encodeURIComponent (id)}`)
        .then (
            json => dispatch (fetchSingleTeamSuccess (json)),
            () => dispatch (fetchSingleTeamFailure (id))
        );
  }
}
