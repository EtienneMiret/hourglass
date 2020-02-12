import {
  FETCH_SINGLE_USER_FAILURE,
  FETCH_SINGLE_USER_REQUEST,
  FETCH_SINGLE_USER_SUCCESS, fetchSingleUserFailure,
  fetchSingleUserRequest,
  fetchSingleUserSuccess
} from '../../../main/ts/actions/user';

describe ('User actions', () => {

  test ('fetchSingleUserRequest ()', () => {
    const action = fetchSingleUserRequest ('foo');

    expect (action.type).toBe (FETCH_SINGLE_USER_REQUEST);
    expect (action.id).toBe ('foo');
  });

  test ('fetchSingleUserSuccess ()', () => {
    const user = {
      id: 'foo',
      teamId: 'bar',
      name: 'Foo',
      emails: ['foo@example.com']
    };
    const action = fetchSingleUserSuccess (user);

    expect (action.type).toBe (FETCH_SINGLE_USER_SUCCESS);
    expect (action.response).toBe (user);
  });

  test ('fetchSingleUserFailure ()', () => {
    const action = fetchSingleUserFailure ('foo');

    expect (action.type).toBe (FETCH_SINGLE_USER_FAILURE);
    expect (action.id).toBe ('foo');
  });

});
