import { NewTeam, Team } from '../state/team';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../state';
import { Action } from './index';
import { patch, post } from '../lib/http';
import { fetchSingleTeamFailure, fetchSingleTeamSuccess } from './team';
import { fetchTeamFailure } from './teams';

export const EDIT_TEAM_START = 'EDIT_TEAM_START';
export const EDIT_TEAM_SET_NAME = 'EDIT_TEAM_SET_NAME';
export const EDIT_TEAM_SET_COLOR = 'EDIT_TEAM_SET_COLOR';
export const EDIT_TEAM_SUBMIT = 'EDIT_TEAM_SUBMIT';
export const EDIT_TEAM_CREATION_SUCCESS = 'EDIT_TEAM_CREATION_SUCCESS';
export const EDIT_TEAM_CANCEL = 'EDIT_TEAM_CANCEL';

export interface EditTeamStartAction {
  type: typeof EDIT_TEAM_START;
  id: string | null;
}

export interface EditTeamSetNameAction {
  type: typeof EDIT_TEAM_SET_NAME;
  id: string | null;
  name: string;
}

export interface EditTeamSetColorAction {
  type: typeof EDIT_TEAM_SET_COLOR;
  id: string | null;
  color: string;
}

export interface EditTeamSubmitAction {
  type: typeof EDIT_TEAM_SUBMIT;
  id: string | null;
}

export interface EditTeamCreationSuccess {
  type: typeof EDIT_TEAM_CREATION_SUCCESS;
}

export interface EditTeamCancelAction {
  type: typeof EDIT_TEAM_CANCEL;
  id: string | null;
}

export type EditTeamAction = EditTeamStartAction
  | EditTeamSetNameAction
  | EditTeamSetColorAction
  | EditTeamSubmitAction
  | EditTeamCreationSuccess
  | EditTeamCancelAction;

export function editTeamStart (id: string | null): EditTeamStartAction {
  return {type: EDIT_TEAM_START, id};
}

export function editTeamSetName (id: string | null, name: string): EditTeamSetNameAction {
  return {type: EDIT_TEAM_SET_NAME, id, name};
}

export function editTeamSetColor (id: string | null, color: string): EditTeamSetColorAction {
  return {type: EDIT_TEAM_SET_COLOR, id, color};
}

export function editTeamSubmit (id: string | null): EditTeamSubmitAction {
  return {type: EDIT_TEAM_SUBMIT, id};
}

export function editTeamCreationSuccess (): EditTeamCreationSuccess {
  return {type: EDIT_TEAM_CREATION_SUCCESS};
}

export function editTeamCancel (id: string | null): EditTeamCancelAction {
  return {type: EDIT_TEAM_CANCEL, id};
}

export function createTeam (team: NewTeam, comment: string): ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (editTeamSubmit (null));

    return post ('/teams', {
      comment,
      object: team
    }).then (
        json => {
          dispatch (editTeamCreationSuccess ());
          dispatch (fetchSingleTeamSuccess (json));
        },
        () => dispatch (fetchTeamFailure())
    );
  }
}

export function editTeam (team: Team, comment: string): ThunkAction<Promise<any>, GlobalState, undefined, Action> {
  return function (dispatch) {
    dispatch (editTeamSubmit (team.id));

    return patch (`/teams/${encodeURIComponent (team.id)}`, {
      comment,
      object: team
    }).then (
        json => dispatch (fetchSingleTeamSuccess (json)),
        () => dispatch (fetchSingleTeamFailure (team.id))
    );
  }
}
