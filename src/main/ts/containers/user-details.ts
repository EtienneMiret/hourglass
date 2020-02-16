import { GlobalState } from '../state';
import { HttpStatus } from '../state/status';
import { Action } from 'redux';
import { fetchUser } from '../actions/user';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import {
  UserDetails,
  UserDetailsDispatchProps,
  UserDetailsStateProps
} from '../components/UserDetails';
import { editUserStart } from '../actions/user-edition';
import { fetchTeam } from '../actions/team';

export interface UserDetailsOwnProps {
  match: {
    params: {
      userId: string
    }
  }
}

function getTeam (state: GlobalState, teamId: string) {
  if (!teamId) {
    return {teamStatus: HttpStatus.None};
  }
  const container = state.teams.list[teamId];
  if (!container) {
    return {teamStatus: HttpStatus.None};
  }
  return {
    teamStatus: container.status,
    team: container.team
  };
}

function mapStateToProps (
    state: GlobalState,
    {match: {params: {userId}}}: UserDetailsOwnProps
): UserDetailsStateProps {
  const prefect =
      state.whoami.status == HttpStatus.Success && state.whoami.whoami!.prefect;
  const userContainer = state.users.list[userId];
  if (userContainer) {
    const teamId = userContainer.user && userContainer.user.teamId;
    const {team, teamStatus} = getTeam (state, teamId);

    return {
      prefect,
      team,
      teamStatus,
      edition: userContainer.edition || undefined,
      user: userContainer.user,
      status: userContainer.status
    }
  }

  if (state.users.status === HttpStatus.Success) {
    return {
      prefect,
      status: HttpStatus.None
    }
  }

  return {
    prefect,
    status: state.users.status
  }
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {match: {params: {userId}}}: UserDetailsOwnProps
): UserDetailsDispatchProps {
  return {
    fetchTeam: teamId => dispatch (fetchTeam (teamId)),
    editUser: () => dispatch (editUserStart (userId)),
    fetchUser: () => dispatch (fetchUser (userId))
  }
}

export const UserDetailsContainer = connect<
    UserDetailsStateProps,
    UserDetailsDispatchProps,
    UserDetailsOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (UserDetails);
