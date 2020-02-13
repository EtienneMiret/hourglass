import { HttpStatus } from './status';

export interface NewEvent {
  name: string;
  date: string;
  scaleRuleId: string;
  userIds: string[];
}

export interface Event extends NewEvent {
  id: string;
  points: number;
}

export interface EventContainer {
  edition: Event | null;
  event: Event;
  status: HttpStatus;
}
