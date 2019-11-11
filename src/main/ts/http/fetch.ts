const JSON_TYPE_PATTERN = /^application\/json(\s*;.*)?$/;

export const enum ErrorCode {
  HttpError,
  NoContentType,
  NotJson
}

export class HttpError extends Error {

  constructor (
      readonly request: Request,
      readonly code: ErrorCode,
      readonly response: Response
  ) {
    super (`Failed to fetch ${request.url}.`);
  }

}

function fetch (request: Request) {
  const headers = new Headers(request.headers);
  headers.set ('Accept', 'application/json');
  return window.fetch (new Request (request, {
    headers
  })).then (response => {
    if (!response.ok) {
      throw new HttpError (request, ErrorCode.HttpError, response);
    }

    const contentType = response.headers.get ('Content-Type');
    if (!contentType) {
      throw new HttpError (request, ErrorCode.NoContentType, response);
    }

    if (!JSON_TYPE_PATTERN.test (contentType)) {
      throw new HttpError (request, ErrorCode.NotJson, response);
    }

    return response.json ();
  })
}

export function get (path: string): Promise<any> {
  const request = new Request (path);
  return fetch (request);
}

export function post (path: string, body: any): Promise<any> {
  const request = new Request (path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify (body)
  });
  return fetch (request);
}

export function patch (path: string, body: any): Promise<any> {
  const request = new Request (path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify (body)
  });
  return fetch (request);
}
