import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HttpStatus } from '../state/status';
import { Event } from '../state/event';
import { Rule } from '../state/rule';
import { User } from '../state/user';
import { Loader } from './Loader';
import { EventEditContainer } from '../containers/event-edit';
import { Container, List, ListItem, Typography } from '@material-ui/core';
import { AppBar } from './AppBar';
import { ActionBar } from './ActionBar';
import { Details, DetailsItem } from './Details';

export interface EventDetailsStateProps {
  prefect: boolean;
  event?: Event;
  edition?: Event;
  status: HttpStatus;
  rule?: Rule;
  ruleStatus?: HttpStatus;
  users: User[];
  userStatus?: HttpStatus;
}

export interface EventDetailsDispatchProps {
  edit: () => void;
  fetch: () => void;
  fetchRule: (id: string) => void;
  fetchUsers: () => void;
}

export type EventDetailsProps = EventDetailsStateProps & EventDetailsDispatchProps;

export const EventDetails = (props: EventDetailsProps) => {
  const {t} = useTranslation ();

  function ruleName () {
    switch (props.ruleStatus) {
      case undefined:
      case HttpStatus.None:
        return '';
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        return props.rule!.name;
      case HttpStatus.Failure:
        return t ('event.rule-loading-failed');
    }
  }

  function users (event: Event) {
    if (event.userIds.length === 0) {
      return t ('event.no-users');
    }

    switch (props.userStatus) {
      case undefined:
      case HttpStatus.None:
        return '';
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        return <List>
          {props
              .users
              .filter (user => event.userIds.includes (user.id))
              .map (user => <ListItem key={user.id}>{user.name}</ListItem>)
          }
        </List>;
      case HttpStatus.Failure:
        return t ('event.user-loading-failed');
    }
  }

  function details () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetch ();
        return '';
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        const event = props.event!;
        if (props.ruleStatus === HttpStatus.None) {
          props.fetchRule (event.scaleRuleId);
        }
        if (event.userIds.length > 0 && props.userStatus === HttpStatus.None) {
          props.fetchUsers ();
        }
        const items: DetailsItem[] = [
          {
            id: 'name',
            title: t ('event.name'),
            value: event.name
          },
          {
            id: 'date',
            title: t ('event.date'),
            value: <time dateTime={event.date}>{event.date}</time>
          },
          {
            id: 'rule',
            title: t ('event.rule'),
            value: ruleName ()
          },
          {
            id: 'users',
            title: t ('event.users'),
            value: users (event)
          }
        ];
        return <Details items={items}/>;
      case HttpStatus.Failure:
        return t ('event.loading-failed');
    }
  }

  let edit = undefined;
  if (props.prefect && props.status === HttpStatus.Success) {
    edit = props.edit;
  }

  function popup () {
    if (props.prefect && props.edition) {
      return <EventEditContainer event={props.edition}/>;
    }

    return '';
  }

  return <Container className="event-details">
    <AppBar title={props.event?.name || ('loading')}/>
    <div id="top"/>
    {details ()}
    <ActionBar reload={props.fetch} edit={edit}/>
    {popup ()}
  </Container>;
};
