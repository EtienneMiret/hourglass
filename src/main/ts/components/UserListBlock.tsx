import * as React from 'react';
import { UserList, UserListProps } from './UserList';
import { useTranslation } from 'react-i18next';

export const UserListBlock = (props: UserListProps) => {
  const {t} = useTranslation ();

  return <div className="user-list">
    <UserList
        fetchUsers={props.fetchUsers}
        status={props.status}
        users={props.users}/>
    <button onClick={props.fetchUsers}>{t('reload')}</button>
  </div>;
};
