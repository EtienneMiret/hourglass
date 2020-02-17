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
