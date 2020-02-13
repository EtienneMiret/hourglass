import { HttpStatus } from './status';

export interface WhoAmI {
  id: string;
  teamId: string;
  name: string;
  prefect: boolean;
}

export interface WhoAmIContainer {
  whoami: WhoAmI | null;
  status: HttpStatus;
}
