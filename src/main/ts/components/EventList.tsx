import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Event, NewEvent } from '../state/event';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { EventEditContainer } from '../containers/event-edit';
import { Link } from 'react-router-dom';

export interface EventListStateProps {
  prefect: boolean;
  creation: NewEvent | null;
  events: Event[];
  status: HttpStatus;
}

export interface EventListDispatchProps {
  fetch: () => void;
  startCreate: () => void;
}

export type EventListProps = EventListStateProps & EventListDispatchProps;

export const EventList = (props: EventListProps) => {
  const {t} = useTranslation ();

  function list () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetch ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.events.length === 0) {
          return <div>{t ('events.none')}</div>;
        }
        return <table>
          <thead>
            <th>{t ('event.name')}</th>
            <th>{t ('event.date')}</th>
          </thead>
          <tbody>
            {props.events.map(event => <tr><Link to={`/events/${event.id}`}>
              <td>{event.name}</td>
              <td>{event.date}</td>
            </Link></tr>)}
          </tbody>
        </table>;
      case HttpStatus.Failure:
        return <div>{t ('events.loading-failed')}</div>
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetch} key="reload">{
      t ('actions.reload')
    }</button>);

    if (props.prefect && props.status === HttpStatus.Success) {
      actions.push (<button onClick={props.startCreate} key="create">{
        t ('actions.add')
      }</button>);
    }

    return <div className="actions">{actions}</div>;
  }

  function popup () {
    if (props.prefect && props.creation) {
      return <EventEditContainer event={props.creation}/>;
    }
    return <div/>;
  }

  return <div className="rule-list">
    {list ()}
    {actions ()}
    {popup ()}
  </div>;
};
