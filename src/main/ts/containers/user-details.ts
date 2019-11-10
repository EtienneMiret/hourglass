import { GlobalState } from '../state';
import { HttpStatus } from '../state/status';
import { Action } from 'redux';
import { fetchUser } from '../actions/user';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { UserDetails, UserDetailsDispatchProps, UserDetailsStateProps } from '../components/UserDetails';

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
  const userContainer = state.users.list[userId];
  if (userContainer) {
    return userContainer;
  }

  if (state.users.status === HttpStatus.Success) {
    return {
      status: HttpStatus.None
    }
  }

  return {
    status: state.users.status
  }
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {match: {params: {userId}}}: UserDetailsOwnProps
): UserDetailsDispatchProps {
  return {
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
