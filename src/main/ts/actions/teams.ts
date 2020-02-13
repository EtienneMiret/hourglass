import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Team } from '../state/team';
import { GlobalState } from '../state';
import { get } from '../http/fetch';

export const FETCH_TEAM_REQUEST = 'FETCH_TEAM_REQUEST';
export const FETCH_TEAM_SUCCESS = 'FETCH_TEAM_SUCCESS';
export const FETCH_TEAM_FAILURE = 'FETCH_TEAM_FAILURE';

export interface FetchTeamRequestAction extends Action {
  type: typeof FETCH_TEAM_REQUEST;
}

export interface FetchTeamSuccessAction extends Action {
  type: typeof FETCH_TEAM_SUCCESS;
  response: Team[];
}

export interface FetchTeamFailureAction extends Action {
  type: typeof FETCH_TEAM_FAILURE;
}

export type FetchTeamAction =
  FetchTeamRequestAction | FetchTeamSuccessAction | FetchTeamFailureAction;

function fetchTeamRequest (): FetchTeamRequestAction {
  return {
    type: FETCH_TEAM_REQUEST
  };
}

function fetchTeamSuccess (response: Team[]): FetchTeamSuccessAction {
  return {
    type: FETCH_TEAM_SUCCESS,
    response
  };
}

function fetchTeamFailure (): FetchTeamFailureAction {
  return {
    type: FETCH_TEAM_FAILURE
  };
}

export function fetchTeams (): ThunkAction<Promise<FetchTeamAction>, GlobalState, undefined, FetchTeamAction> {
  return function (dispatch) {
    dispatch (fetchTeamRequest ());

    return get ('/teams')
        .then (
            json => dispatch (fetchTeamSuccess (json)),
            () => dispatch (fetchTeamFailure ())
        );
  }
}