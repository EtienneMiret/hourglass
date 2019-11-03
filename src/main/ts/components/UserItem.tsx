import { User } from '../state/user';
import * as React from 'react';

export interface UserItemProps {
  user: User
}

export const UserItem = (props: UserItemProps) =>
    <li>{props.user.name}</li>
