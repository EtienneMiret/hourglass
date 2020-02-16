import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HttpStatus } from '../state/status';
import { Event } from '../state/event';
import { Rule } from '../state/rule';
import { User } from '../state/user';
import { Loader } from './Loader';
import { EventEditContainer } from '../containers/event-edit';

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
        return <ol>
          {props
              .users
              .filter (user => event.userIds.includes (user.id))
              .map (user => <li key={user.id}>{user.name}</li>)
          }
        </ol>;
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
        return <dl>
          <div className="name">
            <dt>{t ('event.name')}</dt>
            <dd>{event.name}</dd>
          </div>
          <div className="date">
            <dt>{t ('event.date')}</dt>
            <dd><time dateTime={event.date}>{event.date}</time></dd>
          </div>
          <div className="rule">
            <dt>{t ('event.rule')}</dt>
            <dd>{ruleName ()}</dd>
          </div>
          <div className="users">
            <dt>{t ('event.users')}</dt>
            <dd>{users (event)}</dd>
          </div>
        </dl>;
      case HttpStatus.Failure:
        return t ('event.loading-failed');
    }
  }

  function actions () {
    const actions: any[] = [];
    actions.push (<button onClick={props.fetch} key="reload">{
      t ('actions.reload')
    }</button>);

    if (props.prefect && props.status === HttpStatus.Success) {
      actions.push (<button onClick={props.edit} key="edit">{
        t ('actions.edit')
      }</button>);
    }

    return <div className="actions">{actions}</div>;
  }

  function popup () {
    if (props.prefect && props.edition) {
      return <EventEditContainer event={props.edition}/>;
    }

    return '';
  }

  return <div className="event-details">
    {details ()}
    {actions ()}
    {popup ()}
  </div>;
};
