import { User } from '../state/user';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface UserItemProps {
  user: User
}

export const UserListItem = (props: UserItemProps) =>
    <li><Link to={`/users/${props.user.id}`}>{props.user.name}</Link></li>;
