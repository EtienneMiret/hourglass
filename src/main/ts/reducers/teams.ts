import { TeamCreation, TeamListState, Teams } from '../state/team-list';
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
import {
  EDIT_TEAM_CANCEL,
  EDIT_TEAM_CREATION_SUCCESS,
  EDIT_TEAM_SET_COLOR,
  EDIT_TEAM_SET_NAME,
  EDIT_TEAM_START,
  EDIT_TEAM_SUBMIT
} from '../actions/team-edition';
import { NewTeam } from '../state/team';

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

    /* Team edition actions. */
    case EDIT_TEAM_START: {
      if (action.id === null) {
        const team: NewTeam = {
          name: '',
          color: ''
        };
        return Object.assign({}, state, {
          creation: {team, status: HttpStatus.None}
        });
      } else {
        const edition = state.list[action.id].team;
        const teamContainer = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: teamContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_TEAM_SET_NAME: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const team = Object.assign ({}, state.creation.team, {
          name: action.name
        });
        const creation: TeamCreation = {team, status: HttpStatus.None};
        return Object.assign ({}, state, {creation});
      } else {
        if (state.list[action.id].edition === null) {
          return state;
        }
        const edition = Object.assign ({}, state.list[action.id].edition, {
          name: action.name
        });
        const teamContainer = Object.assign ({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: teamContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_TEAM_SET_COLOR: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        const team = Object.assign ({}, state.creation.team, {
          color: action.color
        });
        const creation: TeamCreation = {team, status: HttpStatus.None};
        return Object.assign ({}, state, {creation});
      } else {
        if (state.list[action.id].edition === null) {
          return state;
        }
        const edition = Object.assign ({}, state.list[action.id].edition, {
          color: action.color
        });
        const teamContainer = Object.assign({}, state.list[action.id], {edition});
        const list = Object.assign ({}, state.list, {
          [action.id]: teamContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_TEAM_SUBMIT: {
      if (action.id === null) {
        if (state.creation === null) {
          return state;
        }
        return Object.assign({}, state, {
          creation: null,
          status: HttpStatus.Progressing
        });
      } else {
        const teamContainer = Object.assign ({}, state.list[action.id], {
          edition: null,
          status: HttpStatus.Progressing
        });
        const list = Object.assign ({}, state.list, {
          [action.id]: teamContainer
        });
        return Object.assign ({}, state, {list});
      }
    }
    case EDIT_TEAM_CREATION_SUCCESS: {
      return Object.assign ({}, state, {status: HttpStatus.Success});
    }
    case EDIT_TEAM_CANCEL: {
      if (action.id === null) {
        return Object.assign ({}, state, {creation: null});
      } else {
        const teamContainer = Object.assign ({}, state.list[action.id], {
          edition: null
        });
        const list = Object.assign ({}, state.list, {
          [action.id]: teamContainer
        });
        return Object.assign ({}, state, {list});
      }
    }

    default:
      return state;
  }
}
