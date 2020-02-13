import { WhoAmIContainer } from '../state/who-am-i';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import {
  FETCH_WHOAMI_FAILURE,
  FETCH_WHOAMI_REQUEST,
  FETCH_WHOAMI_SUCCESS
} from '../actions/who-am-i';

export function whoami (
    state: WhoAmIContainer = {whoami: null, status: HttpStatus.None},
    action: Action
) {
  switch (action.type) {
    case FETCH_WHOAMI_REQUEST:
      return {
        whoami: null,
        status: HttpStatus.Progressing
      };
    case FETCH_WHOAMI_SUCCESS:
      return {
        whoami: action.response,
        status: HttpStatus.Success
      };
    case FETCH_WHOAMI_FAILURE:
      return {
        whoami: null,
        status: HttpStatus.Failure
      };
    default:
      return state;
  }
}
