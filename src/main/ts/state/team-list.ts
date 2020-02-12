import { NewTeam, TeamContainer } from './team';
import { HttpStatus } from './status';

export interface Teams {
  [key: string]: TeamContainer;
}

export interface TeamCreation {
  team: NewTeam;
  status: HttpStatus;
}

export interface TeamListState {
  creation: TeamCreation | null;
  list: Teams;
  status: HttpStatus;
}
