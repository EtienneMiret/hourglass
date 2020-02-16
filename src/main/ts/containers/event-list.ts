import { Action } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { GlobalState } from '../state';
import { Event } from '../state/event';
import {
  EventList,
  EventListDispatchProps,
  EventListStateProps
} from '../components/EventList';
import { HttpStatus } from '../state/status';
import { fetchEvents } from '../actions/events';

function mapStateToProps (state: GlobalState): EventListStateProps {
  const events: Event[] = Object.values (state.events.list)
      .map (e => e.event);
  events.sort ((a, b) => a.date.localeCompare (b.date));
  const prefect = state.whoami.status === HttpStatus.Success
      && state.whoami.whoami!.prefect;
  const creation =
      state.events.creation === null ? null : state.events.creation.event;
  return {
    prefect,
    creation,
    events,
    status: state.events.status
  };
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>
): EventListDispatchProps {
  return {
    fetch: () => dispatch (fetchEvents ())
  }
}

export const EventListContainer = connect<
    EventListStateProps,
    EventListDispatchProps,
    {},
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (EventList);
