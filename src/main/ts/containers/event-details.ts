import { connect } from 'react-redux';
import { GlobalState } from '../state';
import {
  EventDetails,
  EventDetailsDispatchProps,
  EventDetailsStateProps
} from '../components/EventDetails';
import { HttpStatus } from '../state/status';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from '../actions';
import { editEventStart } from '../actions/event-edition';
import { fetchEvent } from '../actions/event';
import { fetchRule } from '../actions/rule';
import { fetchUsers } from '../actions/users';

export interface EventDetailsOwnProps {
  match: {
    params: {
      eventId: string;
    }
  }
}

function mapStateToProps (
    state: GlobalState,
    {match: {params: {eventId}}}: EventDetailsOwnProps
): EventDetailsStateProps {
  const prefect =
      state.whoami.status === HttpStatus.Success && state.whoami.whoami!.prefect;

  const container = state.events.list[eventId];
  if (!container || container.status !== HttpStatus.Success) {
    let status: HttpStatus;
    if (container) {
      status = container.status;
    } else if (state.events.status === HttpStatus.Success) {
      status = HttpStatus.None;
    } else {
      status = state.events.status;
    }

    return {
      prefect,
      users: [],
      status
    };
  }

  const event = container.event;

  const users = Object.values (state.users.list)
      .map (c => c.user)
      .filter (user => event.userIds.includes (user.id));
  users.sort ((a, b) => a.name.lastIndexOf (b.name));

  const ruleContainer = state.rules.list[event.scaleRuleId];
  const rule = ruleContainer ? ruleContainer.rule : undefined;
  let ruleStatus: HttpStatus;
  if (ruleContainer) {
    ruleStatus = ruleContainer.status;
  } else if (state.rules.status === HttpStatus.Success) {
    ruleStatus = HttpStatus.None;
  } else {
    ruleStatus = state.rules.status;
  }

  return {
    prefect,
    event,
    edition: container.edition || undefined,
    status: HttpStatus.Success,
    rule,
    ruleStatus,
    users,
    userStatus: state.users.status
  }
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {match: {params: {eventId}}}: EventDetailsOwnProps
): EventDetailsDispatchProps {
  return {
    edit: () => dispatch (editEventStart (eventId)),
    fetch: () => dispatch (fetchEvent (eventId)),
    fetchRule: (ruleId) => dispatch (fetchRule (ruleId)),
    fetchUsers: () => dispatch (fetchUsers ())
  }
}

export const EventDetailsContainer = connect<
    EventDetailsStateProps,
    EventDetailsDispatchProps,
    EventDetailsOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (EventDetails);
