import { connect } from 'react-redux';
import { GlobalState } from '../state';
import { fetchUsers } from '../actions/users';
import {
  UserList,
  UserListDispatchProps,
  UserListStateProps
} from '../components/UserList';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { editUserStart } from '../actions/user-edition';
import { HttpStatus } from '../state/status';
import { fetchEvents } from '../actions/events';
import { fetchTeams } from '../actions/teams';

function mapStateToProps (state: GlobalState): UserListStateProps {
  return {
    prefect: state.whoami.status === HttpStatus.Success && state.whoami.whoami!.prefect,
    creation: state.users.creation?.user || null,
    users: Object.values (state.users.list).map (c => c.user),
    status: state.users.status,
    events: Object.values (state.events.list).map (c => c.event),
    eventStatus: state.events.status,
    teams: Object.values (state.teams.list).map (c => c.team),
    teamStatus: state.teams.status
  };
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>
): UserListDispatchProps {
  return {
    fetchUsers: () => dispatch (fetchUsers ()),
    fetchEvents: () => dispatch (fetchEvents ()),
    fetchTeams: () => dispatch (fetchTeams ()),
    startCreate: () => dispatch (editUserStart (null))
  }
}

export const UserListContainer = connect<
    UserListStateProps,
    UserListDispatchProps,
    {},
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (UserList);
