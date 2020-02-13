import { UserListState } from './user-list';
import { TeamListState } from './team-list';
import { EventListState } from './event-list';
import { WhoAmIContainer } from './who-am-i';

export interface GlobalState {
  whoami: WhoAmIContainer;
  users: UserListState;
  teams: TeamListState;
  events: EventListState;
}
