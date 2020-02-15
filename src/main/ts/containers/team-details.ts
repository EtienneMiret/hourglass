import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { GlobalState } from '../state';
import { HttpStatus } from '../state/status';
import {
  TeamDetails,
  TeamDetailsDispatchProps,
  TeamDetailsStateProps
} from '../components/TeamDetails';
import { fetchSingleTeamRequest, fetchTeam } from '../actions/team';
import { editTeamStart } from '../actions/team-edition';

export interface TeamDetailsOwnProps {
  match: {
    params: {
      teamId: string;
    }
  }
}

function mapStateToProps (
    state: GlobalState,
    {match: {params: {teamId}}}: TeamDetailsOwnProps
): TeamDetailsStateProps {
  const prefect =
      state.whoami.status === HttpStatus.Success && state.whoami.whoami!.prefect;
  const container = state.teams.list[teamId];
  if (container) {
    return {
      prefect,
      edition: container.edition || undefined,
      team: container.team,
      status: container.status
    };
  }

  if (state.teams.status === HttpStatus.Success) {
    return {
      prefect,
      status: HttpStatus.None
    }
  }

  return {
    prefect,
    status: state.teams.status
  }
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {match: {params: {teamId}}}: TeamDetailsOwnProps
): TeamDetailsDispatchProps {
  return {
    fetch: () => dispatch (fetchTeam (teamId)),
    edit: () => dispatch (editTeamStart (teamId))
  }
}

export const TeamDetailsContainer = connect<
    TeamDetailsStateProps,
    TeamDetailsDispatchProps,
    TeamDetailsOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (TeamDetails);
