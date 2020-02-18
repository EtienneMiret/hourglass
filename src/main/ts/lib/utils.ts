import { Event} from '../state/event';
import { HttpStatus } from '../state/status';

export function combine (...statuses: HttpStatus[]): HttpStatus {
  const ordered = [
    HttpStatus.Failure,
    HttpStatus.None,
    HttpStatus.Progressing,
    HttpStatus.Success
  ];
  for (const status of ordered) {
    if (statuses.includes (status)) {
      return status;
    }
  }
  return HttpStatus.None;
}

export function compareEvent (a: Event, b: Event): number {
  const dateComparison = - a.date.localeCompare (b.date);
  if (dateComparison === 0) {
    return a.name.localeCompare (b.name);
  }
  return dateComparison;
}
