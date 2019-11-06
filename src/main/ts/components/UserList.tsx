import * as React from 'react';
import { User } from '../state/user';
import { HttpStatus } from '../state/status';
import { UserItem } from './UserItem';
import { Loader } from './Loader';
import { useTranslation } from 'react-i18next';

export interface UserListProps {
  users: User[],
  status: HttpStatus
}

export const UserList = (props: UserListProps) => {
  const {t} = useTranslation ();

  switch (props.status) {
    case HttpStatus.None:
      return <button>{t('load')}</button>;
    case HttpStatus.Progressing:
      return <Loader/>;
    case HttpStatus.Success:
      if (props.users.length === 0) {
        return <div>{t('users.none')}</div>
      }
      return <ol>{props.users.map (user => <UserItem user={user} key={user.id}/>)}</ol>;
    case HttpStatus.Failure:
      return <div>{t('users.loading-failed')}</div>
  }
};
