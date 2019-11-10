const JSON_TYPE_PATTERN = /^application\/json(\s*;.*)?$/;

const enum ErrorCode {
  HttpError,
  NoContentType,
  NotJson
}

class HttpError extends Error {

  constructor (
      private path: string,
      private code: ErrorCode,
      private response: Response
  ) {
    super (`Failed to fetch ${path}`);
  }

}

export function fetchJson (path: string) {
  return fetch (path, {
    headers: {
      'Accept': 'application/json'
    }
  }).then (response => {
    if (!response.ok) {
      throw new HttpError (path, ErrorCode.HttpError, response);
    }

    const contentType = response.headers.get ('Content-Type');
    if (!contentType) {
      throw new HttpError (path, ErrorCode.NoContentType, response);
    }

    if (!JSON_TYPE_PATTERN.test (contentType)) {
      throw new HttpError (path, ErrorCode.NotJson, response);
    }

    return response.json ();
  })
}
