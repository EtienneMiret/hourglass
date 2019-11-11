import { NewUser, UserContainer } from './user';
import { HttpStatus } from './status';

export interface Users {
  [key: string]: UserContainer
}

export interface UserCreation {
  user: NewUser,
  status: HttpStatus
}

export interface UserListState {
  creation: UserCreation | null,
  status: HttpStatus,
  list: Users
}
