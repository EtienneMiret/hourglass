import * as React from 'react';
import { User } from '../state/user';
import { HttpStatus } from '../state/status';
import { UserItem } from './UserItem';

export interface UserListProps {
  users: User[],
  status: HttpStatus
}

export const UserList = (props: UserListProps) => {
  switch (props.status) {
    case HttpStatus.None:
      return <button>Load</button>;
    case HttpStatus.Progressing:
      return <div>Loading...</div>;
    case HttpStatus.Success:
      if (props.users.length === 0) {
        return <div>No user (yet).</div>
      }
      return <ol>{props.users.map (user => <UserItem user={user} key={user.id}/>)}</ol>;
    case HttpStatus.Failure:
      return <div>Sorry, loading users failed.</div>
  }
};
