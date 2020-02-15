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

function mapStateToProps (state: GlobalState): UserListStateProps {
  const users = Object.values (state.users.list)
      .map (u => u.user);
  users.sort ((a, b) => a.name.localeCompare (b.name));
  return {
    prefect: state.whoami.status === HttpStatus.Success && state.whoami.whoami!.prefect,
    creation: state.users.creation === null ? null : state.users.creation.user,
    users,
    status: state.users.status
  };
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>
): UserListDispatchProps {
  return {
    fetchUsers: () => dispatch (fetchUsers ()),
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
