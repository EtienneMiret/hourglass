import { UserListState } from './user-list';
import { TeamListState } from './team-list';
import { EventListState } from './event-list';

export interface GlobalState {
  users: UserListState;
  teams: TeamListState;
  events: EventListState;
}
