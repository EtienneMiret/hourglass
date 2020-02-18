import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { ActionBar } from './ActionBar';
import { useTranslation } from 'react-i18next';
import { Event, NewEvent } from '../state/event';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { EventEditContainer } from '../containers/event-edit';
import { AppBar } from './AppBar';

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
        return <TableContainer><Table>
          <TableHead>
            <TableRow>
              <TableCell>{t ('event.name')}</TableCell>
              <TableCell>{t ('event.date')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.events.map (event =>
                <TableRow key={event.id}>
                  <Link to={`/events/${event.id}`}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                  </Link>
                </TableRow>
            )}
          </TableBody>
        </Table></TableContainer>;
      case HttpStatus.Failure:
        return <div>{t ('events.loading-failed')}</div>
    }
  }

  let add = undefined;
  if (props.prefect && props.status === HttpStatus.Success) {
    add = props.startCreate;
  }

  function popup () {
    if (props.prefect && props.creation) {
      return <EventEditContainer event={props.creation}/>;
    }
    return <div/>;
  }

  return <Container className="rule-list">
    <AppBar title={t ('events.title')}/>
    <div id="top"/>
    {list ()}
    <ActionBar reload={props.fetch} add={add}/>
    {popup ()}
  </Container>;
};
