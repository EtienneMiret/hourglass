import { ErrorCode, get, HttpError, patch, post } from '../../../main/ts/http/fetch';

describe ('HTTP fetch', () => {
  beforeEach (() => {
    fetchMock.resetMocks ()
  });

  describe ('get ()', () => {

    it ('should succeed with JSON', () => {
      const response = {
        message: 'Hello World!'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return get ('/hello-world').then (actual => {
        expect (actual).toEqual (response);
        expect (fetchMock.mock.calls.length).toBe (1);
        expect (fetchMock.mock.calls[0].length).toBe (1);
        const request = fetchMock.mock.calls[0][0] as Request;
        expect (request.method).toBe ('GET');
        expect (request.url).toBe ('/hello-world');
        expect (request.headers.get ('Accept')).toBe ('application/json');
      });
    });

    it ('should fail on 404', () => {
      const response = {
        code: 404,
        message: 'Not found'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return get ('/hello-world').then (
          () => expect ('success handler').toBe ('never called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.HttpError);
            expect (error.response.status).toBe (404);
          }
      );
    });

    it ('should fail when Content-Type is missing', () => {
      const response = {
        message: 'Hello World!'
      };
      fetchMock.mockResponse (JSON.stringify (response));

      return get ('/hello-world').then (
          () => expect ('success handler').toBe ('never-called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.NoContentType);
            expect (error.response.ok).toBeTruthy ();
          }
      );
    });

    it ('should fail when ContentType is not JSON', () => {
      const response = {
        message: 'Hello World!'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'application/json2000'
        }
      });

      return get ('/hello-world').then (
          () => expect ('success handler').toBe ('never-called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.NotJson);
            expect (error.response.ok).toBeTruthy ();
          }
      );
    });

    it ('should succeed on JSON Content-Type with parameters', () => {
      const response = {
        message: 'Hello World!'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'application/json;charset=US-ASCII'
        }
      });

      return get ('/hello-world').then (actual => {
        expect (actual).toEqual (response);
      });
    });

  });

  describe ('post ()', () => {

    it ('should succeed with JSON', () => {
      const request = {
        message: 'How are you?'
      };
      const response = {
        message: 'I’m fine, thank you.'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return post ('/hello-world', request).then (actual => {
        expect (actual).toEqual (response);
        expect (fetchMock.mock.calls.length).toBe (1);
        expect (fetchMock.mock.calls[0].length).toBe (1);
        const request = fetchMock.mock.calls[0][0] as Request;
        expect (request.method).toBe ('POST');
        expect (request.url).toBe ('/hello-world');
        expect (request.headers.get ('Accept')).toBe ('application/json');
        expect (request.headers.get ('Content-Type'))
            .toBe ('application/json');
        return request.json ();
      }).then (actual => expect (actual).toEqual (request));
    });

    it ('should fail on 404', () => {
      const request = {
        message: 'How are you?'
      };
      const response = {
        code: 404,
        message: 'Not found'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return post ('/hello-world', request).then (
          () => expect ('success handler').toBe ('never called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.HttpError);
            expect (error.response.status).toBe (404);
          }
      );
    });

    it ('should fail when Content-Type is missing', () => {
      const request = {
        message: 'How are you?'
      };
      const response = {
        message: 'I’m fine, thank you!'
      };
      fetchMock.mockResponse (JSON.stringify (response));

      return post ('/hello-world', request).then (
          () => expect ('success handler').toBe ('never-called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.NoContentType);
            expect (error.response.ok).toBeTruthy ();
          }
      );
    });

    it ('should fail when ContentType is not JSON', () => {
      const request = {
        message: 'How are you?'
      };
      const response = {
        message: 'It’s okay, I’m fine.'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'test/plain'
        }
      });

      return post ('/hello-world', request).then (
          () => expect ('success handler').toBe ('never-called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.NotJson);
            expect (error.response.ok).toBeTruthy ();
          }
      );
    });

    it ('should succeed on JSON Content-Type with parameters', () => {
      const message = {
        message: 'Hello World!'
      };
      fetchMock.mockResponse (JSON.stringify (message), {
        headers: {
          'Content-Type': 'application/json;charset=US-ASCII'
        }
      });

      return post ('/hello-world', message).then (actual => {
        expect (actual).toEqual (message);
      });
    });

  });

  describe ('patch ()', () => {

    it ('should succeed with JSON', () => {
      const request = {
        message: 'How are you.'
      };
      const response = {
        message: 'I’m doing great!'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return patch ('/hello-world', request).then (actual => {
        expect (actual).toEqual (response);
        expect (fetchMock.mock.calls.length).toBe (1);
        expect (fetchMock.mock.calls[0].length).toBe (1);
        const request = fetchMock.mock.calls[0][0] as Request;
        expect (request.method).toBe ('PATCH');
        expect (request.url).toBe ('/hello-world');
        expect (request.headers.get ('Accept')).toBe ('application/json');
        expect (request.headers.get ('Content-Type'))
            .toBe ('application/json');
        return request.json ();
      }).then (actual => expect (actual).toEqual (request));
    });

    it ('should fail on 404', () => {
      const request = {
        message: 'Who are you?'
      };
      const response = {
        code: 404,
        message: 'Not found'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return patch ('/hello-world', request).then (
          () => expect ('success handler').toBe ('never called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.HttpError);
            expect (error.response.status).toBe (404);
          }
      );
    });

    it ('should fail when Content-Type is missing', () => {
      const request = {
        message: 'Hi there!'
      };
      const response = {
        message: 'Hello World!'
      };
      fetchMock.mockResponse (JSON.stringify (response));

      return patch ('/hello-world', request).then (
          () => expect ('success handler').toBe ('never-called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.NoContentType);
            expect (error.response.ok).toBeTruthy ();
          }
      );
    });

    it ('should fail when ContentType is not JSON', () => {
      const request = {
        message: 'Hello!'
      };
      const response = {
        message: 'Hello World!'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'application/json-plus'
        }
      });

      return patch ('/hello-world', request).then (
          () => expect ('success handler').toBe ('never-called'),
          (error: HttpError) => {
            expect (error.message).toBe ('Failed to fetch /hello-world.');
            expect (error.code).toBe (ErrorCode.NotJson);
            expect (error.response.ok).toBeTruthy ();
          }
      );
    });

    it ('should succeed on JSON Content-Type with parameters', () => {
      const request = {
        message: 'How are you doing?'
      };
      const response = {
        message: 'I am doing great!'
      };
      fetchMock.mockResponse (JSON.stringify (response), {
        headers: {
          'Content-Type': 'application/json;charset=US-ASCII'
        }
      });

      return patch ('/hello-world', request).then (actual => {
        expect (actual).toEqual (response);
      });
    });

  });

});
