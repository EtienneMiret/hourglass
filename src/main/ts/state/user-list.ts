import { User } from './user';
import { HttpStatus } from './status';

export interface Users {
  [key: string]: User
}

export interface UserListState {
  status: HttpStatus,
  list: Users
}
