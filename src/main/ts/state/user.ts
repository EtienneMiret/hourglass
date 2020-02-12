import { HttpStatus } from './status';

export interface NewUser {
  name: string,
  teamId: string,
  emails: string[]
}

export interface User extends NewUser {
  id: string
}

export interface UserContainer {
  edition: User | null,
  user: User,
  status: HttpStatus
}
