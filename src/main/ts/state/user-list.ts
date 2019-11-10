import { UserContainer } from './user';
import { HttpStatus } from './status';

export interface Users {
  [key: string]: UserContainer
}

export interface UserListState {
  status: HttpStatus,
  list: Users
}
