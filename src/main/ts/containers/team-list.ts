import { Action } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { GlobalState } from '../state';
import {
  TeamList,
  TeamListDispatchProps,
  TeamListStateProps
} from '../components/TeamList';
import { HttpStatus } from '../state/status';
import { fetchTeams } from '../actions/teams';

function mapStateToProps (state: GlobalState): TeamListStateProps {
  const teams = Object.values (state.teams.list)
      .map (t => t.team);
  teams.sort ((a, b) => a.name.localeCompare (b.name));
  return {
    prefect: state.whoami.status === HttpStatus.Success && state.whoami.whoami!.prefect,
    creation: state.teams.creation === null ? null : state.teams.creation.team,
    teams,
    status: state.teams.status
  }
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>
): TeamListDispatchProps {
  return {
    fetchTeams: () => dispatch (fetchTeams ())
  }
}

export const TeamListContainer = connect<
    TeamListStateProps,
    TeamListDispatchProps,
    {},
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (TeamList);
