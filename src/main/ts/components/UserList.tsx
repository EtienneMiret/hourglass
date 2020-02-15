import * as React from 'react';
import { NewUser, User } from '../state/user';
import { HttpStatus } from '../state/status';
import { UserListItem } from './UserListItem';
import { Loader } from './Loader';
import { useTranslation } from 'react-i18next';
import { UserEditContainer } from '../containers/user-edit';

export interface UserListStateProps {
  prefect: boolean;
  creation: NewUser | null;
  users: User[];
  status: HttpStatus;
}

export interface UserListDispatchProps {
  fetchUsers: () => {};
  startCreate: () => {};
}

export type UserListProps = UserListStateProps & UserListDispatchProps;

export const UserList = (props: UserListProps) => {
  const {t} = useTranslation ();

  function list () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetchUsers ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.users.length === 0) {
          return <div>{t('users.none')}</div>
        }
        return <ol>{props.users.map (user => <UserListItem user={user} key={user.id}/>)}</ol>;
      case HttpStatus.Failure:
        return <div>{t('users.loading-failed')}</div>
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetchUsers} key="reload">{t ('actions.reload')}</button>);

    if (props.prefect && props.status === HttpStatus.Success) {
      actions.push (<button onClick={props.startCreate} key="create">{t ('actions.add')}</button>);
    }

    return <div className="actions">
      {actions}
    </div>;
  }

  function popup () {
    if (props.prefect && props.creation) {
      return <UserEditContainer user={props.creation}/>;
    }

    return <div/>;
  }

  return <div className="user-list">
    {list ()}
    {actions ()}
    {popup ()}
  </div>;
};
