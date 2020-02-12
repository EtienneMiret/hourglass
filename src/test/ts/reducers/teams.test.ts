import {
  FETCH_TEAM_FAILURE,
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS,
  FetchTeamFailureAction,
  FetchTeamRequestAction,
  FetchTeamSuccessAction
} from '../../../main/ts/actions/teams';
import { teams } from '../../../main/ts/reducers/teams';
import { HttpStatus } from '../../../main/ts/state/status';
import { Team } from '../../../main/ts/state/team';
import { TeamListState } from '../../../main/ts/state/team-list';

const gryffindor: Team = Object.freeze ({
  id: 'G0',
  name: 'Gryffindor',
  color: 'red'
});

const hufflepuff: Team = Object.freeze ({
  id: 'H1',
  name: 'Hufflepuff',
  color: 'yellow'
});

const ravenclaw: Team = Object.freeze ({
  id: 'R2',
  name: 'Ravenclaw',
  color: 'blue'
});

const slytherin: Team = Object.freeze ({
  id: 'S3',
  name: 'Slytherin',
  color: 'green'
});

const loaded: TeamListState = Object.freeze ({
  creation: null,
  list: {
    'G0': {
      edition: null,
      team: gryffindor,
      status: HttpStatus.Success
    },
    'H1': {
      edition: null,
      team: hufflepuff,
      status: HttpStatus.Success
    },
    'R2': {
      edition: null,
      team: ravenclaw,
      status: HttpStatus.Success
    },
    'S3': {
      edition: null,
      team: slytherin,
      status: HttpStatus.Success
    }
  },
  status: HttpStatus.Success
});

const partiallyLoaded: TeamListState = Object.freeze ({
  creation: null,
  list: {
    'G0': {
      edition: null,
      team: gryffindor,
      status: HttpStatus.Success
    },
    'R2': {
      edition: null,
      team: ravenclaw,
      status: HttpStatus.Success
    },
    'S3': {
      edition: null,
      team: slytherin,
      status: HttpStatus.Failure
    }
  },
  status: HttpStatus.Success
});

const creating: TeamListState = Object.freeze ({
  creation: {
    team: {
      name: 'Hogwart',
      color: 'TBD'
    },
    status: HttpStatus.None
  },
  list: {},
  status: HttpStatus.Success
});

const testCases = [
  {name: 'undefined', state: undefined},
  {name: 'loaded', state: loaded},
  {name: 'partially loaded', state: partiallyLoaded},
  {name: 'creating', state: creating}
];

describe ('Team reducers', () => {

  describe ('fetch actions', () => {

    describe (FETCH_TEAM_REQUEST, () => {

      const action: FetchTeamRequestAction = {
        type: FETCH_TEAM_REQUEST
      };

      testCases.forEach (testCase => {
        describe (`when current state is ${testCase.name}.`, () => {

          it ('should set status to "Progressing"', () => {
            const actual = teams (testCase.state, action);

            expect (actual.status).toBe (HttpStatus.Progressing);
          });

        });
      });

    });

    describe (FETCH_TEAM_SUCCESS, () => {

      const action: FetchTeamSuccessAction = {
        type: FETCH_TEAM_SUCCESS,
        response: [gryffindor, hufflepuff, slytherin, ravenclaw]
      };

      testCases.forEach (testCase => {
        describe (`when current state is ${testCase.name}`, () => {

          it ('should set status to "Success"', () => {
            const actual = teams (testCase.state, action);

            expect (actual.status).toBe (HttpStatus.Success);
          });

          it ('should fill list', () => {
            const actual = teams (testCase.state, action);

            expect (actual.list['G0'].team).toEqual (gryffindor);
            expect (actual.list['H1'].team).toEqual (hufflepuff);
            expect (actual.list['R2'].team).toEqual (ravenclaw);
            expect (actual.list['S3'].team).toEqual (slytherin);
          });

          it ('should set each list item status to "Success"', () => {
            const actual = teams (testCase.state, action);

            Object.values (actual.list).forEach (item => {
              expect (item.status).toBe (HttpStatus.Success);
            });
          });

        });
      });

    });

    describe (FETCH_TEAM_FAILURE, () => {

      const action: FetchTeamFailureAction = {
        type: FETCH_TEAM_FAILURE
      };

      testCases.forEach (testCase => {
        describe (`when current state is ${testCase.name}`, () => {

          it ('should set status to "Failure"', () => {
            const actual = teams (testCase.state, action);

            expect (actual.status).toBe (HttpStatus.Failure);
          });

        });
      });

    });

  });

});
