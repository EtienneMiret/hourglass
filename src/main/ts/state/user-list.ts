import { User } from './user';
import { HttpStatus } from './status';

export interface UserListState {
  status: HttpStatus,
  list: User[]
}
