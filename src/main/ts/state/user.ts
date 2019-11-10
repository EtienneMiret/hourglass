import { HttpStatus } from './status';

export interface User {
  id: string,
  name: string,
  emails: string[]
}

export interface UserContainer {
  user: User,
  status: HttpStatus
}
