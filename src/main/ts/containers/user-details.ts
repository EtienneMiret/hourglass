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
import {
  editUser,
  editUserAddEmail, editUserFinish, editUserRemoveEmail,
  editUserSetName,
  editUserStart, editUserSubmit
} from '../actions/user-edition';

export interface UserDetailsOwnProps {
  match: {
    params: {
      userId: string
    }
  }
}

function mapStateToProps (
    state: GlobalState,
    {match: {params: {userId}}}: UserDetailsOwnProps
): UserDetailsStateProps {
  const prefect =
      state.whoami.status == HttpStatus.Success && state.whoami.whoami!.prefect;
  const userContainer = state.users.list[userId];
  if (userContainer) {
    return {
      prefect,
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
    editUser: () => dispatch (editUserStart (userId)),
    setName: (name) => dispatch (editUserSetName (userId, name)),
    addEmail: (email) => dispatch (editUserAddEmail (userId, email)),
    removeEmail: (email) => dispatch (editUserRemoveEmail (userId, email)),
    submitEdits: (user, comment) => dispatch (editUser (user, comment)),
    cancelEdits: () => dispatch (editUserFinish (userId)),
    fetchUser: () => dispatch (fetchUser (userId))
  }
}

export const UserDetailsContainer = connect<UserDetailsStateProps,
    UserDetailsDispatchProps,
    UserDetailsOwnProps,
    GlobalState> (
    mapStateToProps,
    mapDispatchToProps
) (UserDetails);
