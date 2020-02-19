import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl, IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TextField, Typography
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Event, NewEvent } from '../state/event';
import { Rule } from '../state/rule';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { User } from '../state/user';
import { EditModal } from './EditModal';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import moment = require('moment');

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
  const [comment, saveComment] = useState ('');
  const [userFilter, setUserFilter] = useState ('');

  function submit () {
    props.submitEdits (comment);
  }

  function rename (event: React.ChangeEvent<HTMLInputElement>) {
    props.setName (event.target.value);
  }

  function changeDate (date: MaterialUiPickersDate) {
    props.setDate (date?.format ('YYYY-MM-DD') || '');
  }

  function changeRule (event: React.ChangeEvent<{value: unknown}>) {
    props.setRule (event.target.value as string);
  }

  function updateComment (event: React.ChangeEvent<{value: unknown}>) {
    saveComment (event.target.value as string);
  }

  function filter (event: React.ChangeEvent<HTMLInputElement>) {
    setUserFilter (event.target.value.toLocaleLowerCase ());
  }

  function title () {
    if ((props.event as Event).id) {
      return t ('edit.event.update', props.event);
    } else {
      return t ('edit.event.create');
    }
  }

  function date () {
    if (props.event.date) {
      return moment (props.event.date);
    } else {
      return moment ();
    }
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
        return <Select
            variant="outlined"
            labelId="team-label"
            value={props.event.scaleRuleId}
            onChange={changeRule}>
          <MenuItem value="" disabled>{t ('edit.event.select-rule')}</MenuItem>
          {props.rules.map (rule =>
              <MenuItem value={rule.id} key={rule.id}>{rule.name}</MenuItem>)}
        </Select>;
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
          return <Typography variant="body1">{t ('event.no-users')}</Typography>;
        }
        return <List className="event-users">
          {props.users
              .filter (user => props.event.userIds.includes (user.id))
              .map (user => <ListItem key={user.id}>
                <ListItemText primary={user.name}/>
                <ListItemSecondaryAction onClick={() => props.removeUser (user.id)}>
                  <IconButton edge="end">
                    <DeleteIcon/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>)
          }
        </List>;
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
      <TextField label={t ('edit.event.filter')}
          fullWidth={true}
          value={userFilter}
          onChange={filter}/>
      <List>
        {users.map (user => <ListItem key={user.id}>
          <ListItemText primary={user.name}/>
          <ListItemSecondaryAction onClick={() => props.addUser (user.id)}>
            <IconButton edge="end">
              <AddIcon/>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>)}
      </List>
    </div>;
  }

  return <EditModal title={title ()} cancel={props.cancelEdits} save={submit}>
    <TextField variant="outlined" label={t ('event.name')}
        fullWidth={true} value={props.event.name} onChange={rename}/>
    <FormControl variant="outlined" fullWidth={true}>
      <KeyboardDatePicker value={date ()} onChange={changeDate} fullWidth={true}
          variant="inline" format="YYYY-MM-DD" label={t ('event.date')}/>
    </FormControl>
    <FormControl variant="outlined" fullWidth={true}>
      <InputLabel id="rule-label">{t ('event.rule')}</InputLabel>
      {ruleSelect ()}
    </FormControl>
    <FormControl variant="outlined" fullWidth={true}>
      <Typography variant="caption">{t ('event.users')}</Typography>
      {eventUsers ()}
      {availableUsers ()}
    </FormControl>
    <TextField variant="outlined" label={t ('edit.comment')} fullWidth={true}
        value={comment} onChange={updateComment}/>
  </EditModal>;
};
