import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Event, NewEvent } from '../state/event';
import { Rule } from '../state/rule';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { User } from '../state/user';

export interface EventEditStateProps {
  event: Event | NewEvent;
  rules: Rule[];
  ruleStatus: HttpStatus;
  users: User[];
  userStatus: HttpStatus;
}

export interface EventEditDispatchProps {
  setName: (name: string) => void;
  setDate: (date: string) => void;
  setRule: (ruleId: string) => void;
  addUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  submitEdits: (comment: string) => void;
  cancelEdits: () => void;
  fetchRules: () => void;
  fetchUsers: () => void;
}

export type EventEditProps = EventEditStateProps & EventEditDispatchProps;

export const EventEdit = (props: EventEditProps) => {
  const {t} = useTranslation ();
  const [userFilter, setUserFilter] = useState ('');

  function submit (event: React.FormEvent<HTMLFormElement>) {
    const comment = event
        .currentTarget
        .elements
        .namedItem ('comment') as HTMLInputElement;
    props.submitEdits (comment.value);
    event.preventDefault ();
  }

  function rename (event: React.ChangeEvent<HTMLInputElement>) {
    props.setName (event.target.value);
  }

  function changeDate (event: React.ChangeEvent<HTMLInputElement>) {
    props.setDate (event.target.value);
  }

  function changeRule (event: React.ChangeEvent<HTMLSelectElement>) {
    props.setRule (event.target.value);
  }

  function filter (event: React.ChangeEvent<HTMLInputElement>) {
    setUserFilter (event.target.value.toLocaleLowerCase ());
  }

  function ruleSelect () {
    switch (props.ruleStatus) {
      case HttpStatus.None:
        props.fetchRules ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.rules.length === 0) {
          return <div>{t ('rules.none')}</div>;
        }
        return <select value={props.event.scaleRuleId} onChange={changeRule}>
          <option value="">{t ('edit.event.select-rule')}</option>
          {props.rules.map (rule => <option
              value={rule.id}>{rule.name}</option>)}
        </select>;
      case HttpStatus.Failure:
        return <div>{t ('rules.loading-failed')}</div>
    }
  }

  function eventUsers () {
    switch (props.userStatus) {
      case HttpStatus.None:
        props.fetchUsers ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.event.userIds.length === 0) {
          return <div>{t ('event.no-users')}</div>;
        }
        return <ol className="event-users">
          {props.users
              .filter (user => props.event.userIds.includes (user.id))
              .map (user => <li key={user.id}>
                {user.name}
                <button onClick={() => props.removeUser (user.id)}>X</button>
              </li>)
          }
        </ol>;
      case HttpStatus.Failure:
        return <div>{t ('users.loading-failed')}</div>
    }
  }

  function availableUsers () {
    if (props.userStatus !== HttpStatus.Success) {
      return <div/>;
    }

    const users: User[] = props
        .users
        .filter (user => !props.event.userIds.includes (user.id))
        .filter (user => user.name.toLocaleLowerCase ().includes (userFilter))
        .slice (0, 10);

    return <div className="add">
      <input
          placeholder={t ('edit.event.filter')}
          value={userFilter}
          onChange={filter}/>
      <ol>
        {users.map(user => <li key={user.id}>
          {user.name}
          <button onClick={() => props.addUser (user.id)}>+</button>
        </li>)}
      </ol>
    </div>;
  }

  return <div className="event-edit">
    <label className="name">
      {t ('event.name')}
      <input value={props.event.name} onChange={rename}/>
    </label>
    <label className="date">
      {t ('event.date')}
      <input type="date" value={props.event.date} onChange={changeDate}/>
    </label>
    <label className="rule">
      {t ('event.rule')}
      {ruleSelect ()}
    </label>
    <label className="users">
      {t ('event.users')}
      {eventUsers ()}
      {availableUsers ()}
    </label>
    <form onSubmit={submit}>
      <label>{t ('edit.comment')} <input name="comment"/></label>
      <button type="button" onClick={props.cancelEdits}>{
        t ('edit.cancel')
      }</button>
      <button type="submit">{t ('edit.save')}</button>
    </form>
  </div>;
};
