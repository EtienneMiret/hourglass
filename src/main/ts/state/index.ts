import { UserListState } from './user-list';
import { TeamListState } from './team-list';

export interface GlobalState {
  users: UserListState;
  teams: TeamListState;
}
