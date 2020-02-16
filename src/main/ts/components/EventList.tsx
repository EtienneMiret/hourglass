import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NewEvent, Event } from '../state/event';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';

export interface EventListStateProps {
  prefect: boolean;
  creation: NewEvent | null;
  events: Event[];
  status: HttpStatus;
}

export interface EventListDispatchProps {
  fetch: () => void;
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
            {props.events.map(event => <tr>
              <td>{event.name}</td>
              <td>{event.date}</td>
            </tr>)}
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

    return <div className="actions">{actions}</div>;
  }

  return <div className="rule-list">
    {list ()}
    {actions ()}
  </div>;
};
