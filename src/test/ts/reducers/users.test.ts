import {
  EDIT_USER_ADD_EMAIL,
  EDIT_USER_CREATION_SUCCESS,
  EDIT_USER_FINISH,
  EDIT_USER_REMOVE_EMAIL,
  EDIT_USER_SET_NAME,
  EDIT_USER_START,
  EDIT_USER_SUBMIT,
  EditUserAddEmailAction,
  EditUserCreationSuccess,
  EditUserFinishAction,
  EditUserRemoveEmailAction,
  EditUserSetNameAction,
  EditUserStartAction,
  EditUserSubmitAction
} from '../../../main/ts/actions/user-edition';
import { UserListState } from '../../../main/ts/state/user-list';
import { HttpStatus } from '../../../main/ts/state/status';
import { users } from '../../../main/ts/reducers/users';
import { User } from '../../../main/ts/state/user';

const anthonyHead = Object.freeze ({
  id: '451',
  name: 'Anthony Head',
  teamId: 'Gryffindor',
  emails: Object.freeze ([])
}) as unknown as User;

const bradleyJames = Object.freeze ({
  id: '723',
  name: 'Bradley James',
  teamId: 'Gryffindor',
  emails: Object.freeze ([
    'bradley.james@example.org'
  ])
}) as unknown as User;

const initialState = Object.freeze ({
  creation: null,
  status: HttpStatus.Success,
  list: Object.freeze ({
    [anthonyHead.id]: {
      edition: null,
      user: anthonyHead,
      status: HttpStatus.Success
    },
    [bradleyJames.id]: {
      edition: null,
      user: bradleyJames,
      status: HttpStatus.Success
    }
  })
}) as unknown as UserListState;

const creationInProgress = Object.freeze ({
  creation: Object.freeze ({
    user: Object.freeze ({
      name: 'Kathy McGrath',
      teamId: 'Ravenclaw',
      emails: Object.freeze ([
        'kathy@example.com',
        'kathy.mcgrath@example.org'
      ])
    }),
    status: HttpStatus.None
  }),
  status: HttpStatus.Success,
  list: Object.freeze ({
    [anthonyHead.id]: {
      edition: null,
      user: anthonyHead,
      status: HttpStatus.Success
    },
    [bradleyJames.id]: {
      edition: null,
      user: bradleyJames,
      status: HttpStatus.Success
    }
  })
}) as unknown as UserListState;

const editionInProgress = Object.freeze ({
  creation: null,
  status: HttpStatus.Success,
  list: Object.freeze ({
    [anthonyHead.id]: {
      edition: anthonyHead,
      user: anthonyHead,
      status: HttpStatus.Success
    },
    [bradleyJames.id]: {
      edition: bradleyJames,
      user: bradleyJames,
      status: HttpStatus.Success
    }
  })
}) as unknown as UserListState;

describe ('User reducers', () => {

  describe ('edit actions', function () {

    describe (EDIT_USER_START, () => {

      it ('should setup creation', () => {
        const action: EditUserStartAction = {
          type: EDIT_USER_START,
          id: null
        };

        const actual = users (initialState, action);

        expect (actual).toEqual ({
          creation: {
            user: {
              name: '',
              teamId: '',
              emails: []
            },
            status: HttpStatus.None
          },
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: null,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: null,
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

      it ('should setup edition', () => {
        const action: EditUserStartAction = {
          type: EDIT_USER_START,
          id: '451'
        };

        const actual = users (initialState, action);

        expect (actual).toEqual ({
          creation: null,
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: anthonyHead,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: null,
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

    });

    describe (EDIT_USER_SET_NAME, () => {

      it ('should noop when there is no creation in progress', () => {
        const action: EditUserSetNameAction = {
          type: EDIT_USER_SET_NAME,
          id: null,
          name: 'Gwen'
        };

        const actual = users (initialState, action);

        expect (actual).toEqual (initialState);
      });

      it ('should noop when there is no edition in progress', () => {
        const action: EditUserSetNameAction = {
          type: EDIT_USER_SET_NAME,
          id: '451',
          name: 'Uther Pendragon'
        };

        const actual = users (initialState, action);

        expect (actual).toEqual (initialState);
      });

      it ('should set name of new user', () => {
        const action: EditUserSetNameAction = {
          type: EDIT_USER_SET_NAME,
          id: null,
          name: 'Morgana'
        };

        const actual = users (creationInProgress, action);

        expect (actual).toEqual ({
          creation: {
            user: {
              name: 'Morgana',
              teamId: 'Ravenclaw',
              emails: [
                'kathy@example.com',
                'kathy.mcgrath@example.org'
              ]
            },
            status: HttpStatus.None
          },
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: null,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: null,
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

      it ('should set name of edited user', () => {
        const action: EditUserSetNameAction = {
          type: EDIT_USER_SET_NAME,
          id: '723',
          name: 'Arthur Pendragon'
        };

        const actual = users (editionInProgress, action);

        expect (actual).toEqual ({
          creation: null,
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: anthonyHead,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: {
                id: '723',
                name: 'Arthur Pendragon',
                teamId: 'Gryffindor',
                emails: ['bradley.james@example.org']
              },
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

    });

    describe (EDIT_USER_ADD_EMAIL, () => {

      it ('should add email to new user', () => {
        const action: EditUserAddEmailAction = {
          type: EDIT_USER_ADD_EMAIL,
          id: null,
          email: 'cmh@example.com'
        };

        const actual = users (creationInProgress, action);

        expect (actual).toEqual ({
          creation: {
            user: {
              name: 'Kathy McGrath',
              teamId: 'Ravenclaw',
              emails: [
                'kathy@example.com',
                'kathy.mcgrath@example.org',
                'cmh@example.com'
              ]
            },
            status: HttpStatus.None
          },
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: null,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: null,
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

      it ('should add email to existing user', () => {
        const action: EditUserAddEmailAction = {
          type: EDIT_USER_ADD_EMAIL,
          id: '451',
          email: 'king@example.com'
        };

        const actual = users (editionInProgress, action);

        expect (actual).toEqual ({
          creation: null,
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: {
                id: '451',
                name: 'Anthony Head',
                teamId: 'Gryffindor',
                emails: [
                  'king@example.com'
                ]
              },
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: bradleyJames,
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

      it ('should noop if email was already added to new user', () => {
        const action: EditUserAddEmailAction = {
          type: EDIT_USER_ADD_EMAIL,
          id: null,
          email: 'kathy.mcgrath@example.org'
        };

        const actual = users (creationInProgress, action);

        expect (actual).toEqual (creationInProgress);
      });

      it ('should noop if email is known in edited user', () => {
        const action: EditUserAddEmailAction = {
          type: EDIT_USER_ADD_EMAIL,
          id: '723',
          email: 'bradley.james@example.org'
        };

        const actual = users (editionInProgress, action);

        expect (actual).toEqual (editionInProgress);
      });

    });

    describe (EDIT_USER_REMOVE_EMAIL, () => {

      it ('should remove email from new user', () => {
        const action: EditUserRemoveEmailAction = {
          type: EDIT_USER_REMOVE_EMAIL,
          id: null,
          email: 'kathy@example.com'
        };

        const actual = users (creationInProgress, action);

        expect (actual).toEqual ({
          creation: {
            user: {
              name: 'Kathy McGrath',
              teamId: 'Ravenclaw',
              emails: ['kathy.mcgrath@example.org']
            },
            status: HttpStatus.None
          },
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: null,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: null,
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

      it ('should remove email from edited user', () => {
        const action: EditUserRemoveEmailAction = {
          type: EDIT_USER_REMOVE_EMAIL,
          id: '723',
          email: 'bradley.james@example.org'
        };

        const actual = users (editionInProgress, action);

        expect (actual).toEqual ({
          creation: null,
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: anthonyHead,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: {
                id: '723',
                name: 'Bradley James',
                teamId: 'Gryffindor',
                emails: []
              },
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

    });

    describe (EDIT_USER_SUBMIT, () => {

      it ('should flag new user as loading.', () => {
        const action: EditUserSubmitAction = {
          type: EDIT_USER_SUBMIT,
          id: null
        };

        const actual = users (creationInProgress, action);

        expect (actual.status).toBe (HttpStatus.Progressing);
      });

      it ('should flag edited user as loading', () => {
        const action: EditUserSubmitAction = {
          type: EDIT_USER_SUBMIT,
          id: '451'
        };

        const actual = users (editionInProgress, action);

        expect (actual.list['451'].status).toBe (HttpStatus.Progressing);
      });

      it ('should clear created user', () => {
        const action: EditUserSubmitAction = {
          type: EDIT_USER_SUBMIT,
          id: null
        };

        const actual = users (creationInProgress, action);

        expect (actual.creation).toBeNull ();
      });

      it ('should clear edited user', () => {
        const action: EditUserSubmitAction = {
          type: EDIT_USER_SUBMIT,
          id: '451'
        };

        const actual = users (editionInProgress, action);

        expect (actual.list['451'].edition).toBe (null);
      });

    });

    describe (EDIT_USER_CREATION_SUCCESS, () => {

      it ('should set status to Success', () => {

        const action: EditUserCreationSuccess = {
          type: EDIT_USER_CREATION_SUCCESS
        };
        const state: UserListState = {
          creation: null,
          list: {},
          status: HttpStatus.Progressing
        };

        const actual = users (state, action);

        expect (actual.status).toBe (HttpStatus.Success);
      });

    });

    describe (EDIT_USER_FINISH, () => {

      it ('should clear created user', () => {
        const action: EditUserFinishAction = {
          type: EDIT_USER_FINISH,
          id: null
        };

        const actual = users (creationInProgress, action);

        expect (actual).toEqual ({
          creation: null,
          status: HttpStatus.Success,
          list: {
            '451': {
              edition: null,
              user: anthonyHead,
              status: HttpStatus.Success
            },
            '723': {
              edition: null,
              user: bradleyJames,
              status: HttpStatus.Success
            }
          }
        } as UserListState);
      });

    });

  });

});
