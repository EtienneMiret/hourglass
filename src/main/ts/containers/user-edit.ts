import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { GlobalState } from '../state';
import { NewUser, User } from '../state/user';
import {
  UserEdit,
  UserEditDispatchProps,
  UserEditStateProps
} from '../components/UserEdit';
import {
  createUser,
  editUser,
  editUserAddEmail, editUserFinish,
  editUserRemoveEmail,
  editUserSetName
} from '../actions/user-edition';

export interface UserEditOwnProps {
  user: User | NewUser;
}

function mapStateToProps (
    state: GlobalState,
    {user}: UserEditOwnProps
): UserEditStateProps {
  return {
    user
  };
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {user}: UserEditOwnProps
): UserEditDispatchProps {
  const id = (user as User).id || null;

  return {
    setName: name => dispatch (editUserSetName (id, name)),
    addEmail: email => dispatch (editUserAddEmail (id, email)),
    removeEmail: email => dispatch (editUserRemoveEmail (id, email)),
    submitEdits: comment => {
      if (id) {
        return dispatch (editUser (user as User, comment));
      } else {
        return dispatch (createUser (user as NewUser, comment));
      }
    },
    cancelEdits: () => dispatch (editUserFinish (id))
  }
}

export const UserEditContainer = connect<
    UserEditStateProps,
    UserEditDispatchProps,
    UserEditOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (UserEdit);
