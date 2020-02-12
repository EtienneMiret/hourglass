import { HttpStatus } from './status';

export interface NewTeam {
  name: string;
  color: string;
}

export interface Team extends NewTeam {
  id: string;
}

export interface TeamContainer {
  edition: Team | null;
  team: Team;
  status: HttpStatus;
}
