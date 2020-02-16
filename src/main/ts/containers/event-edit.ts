import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Event, NewEvent } from '../state/event';
import { GlobalState } from '../state';
import {
  EventEdit,
  EventEditDispatchProps,
  EventEditStateProps
} from '../components/EventEdit';
import { Action } from '../actions';
import {
  creatEvent,
  editEvent,
  editEventAddUser, editEventCancel, editEventRemoveUser,
  editEventSetDate,
  editEventSetName,
  editEventSetRule
} from '../actions/event-edition';
import { fetchRules } from '../actions/rules';
import { fetchUsers } from '../actions/users';

export interface EventEditOwnProps {
  event: Event | NewEvent;
}

function mapStateToProps (
    state: GlobalState,
    {event}: EventEditOwnProps
): EventEditStateProps {
  const rules = Object.values (state.rules.list)
      .map (r => r.rule);
  rules.sort ((a, b) => a.name.localeCompare (b.name));

  const users = Object.values (state.users.list)
      .map (u => u.user);
  users.sort ((a, b) => a.name.localeCompare (b.name));

  return {
    event,
    rules,
    ruleStatus: state.rules.status,
    users,
    userStatus: state.users.status
  };
}

function mapDispathToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {event}: EventEditOwnProps
): EventEditDispatchProps {
  const id = (event as Event).id || null;

  return {
    setName: name => dispatch (editEventSetName (id, name)),
    setDate: date => dispatch (editEventSetDate (id, date)),
    setRule: ruleId => dispatch (editEventSetRule (id, ruleId)),
    addUser: userId => dispatch (editEventAddUser (id, userId)),
    removeUser: userId => dispatch (editEventRemoveUser (id, userId)),
    submitEdits: comment => {
      if (id) {
        return dispatch (editEvent (event as Event, comment));
      } else {
        return dispatch (creatEvent (event as NewEvent, comment));
      }
    },
    cancelEdits: () => dispatch (editEventCancel (id)),
    fetchRules: () => dispatch (fetchRules ()),
    fetchUsers: () => dispatch (fetchUsers ())
  };
}

export const EventEditContainer = connect<
    EventEditStateProps,
    EventEditDispatchProps,
    EventEditOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispathToProps
) (EventEdit);
