import { EventContainer, NewEvent } from './event';
import { HttpStatus } from './status';

export interface Events {
  [key: string]: EventContainer;
}

export interface EventCreation {
  event: NewEvent;
  status: HttpStatus;
}

export interface EventListState {
  creation: EventCreation | null;
  list: Events;
  status: HttpStatus;
}
