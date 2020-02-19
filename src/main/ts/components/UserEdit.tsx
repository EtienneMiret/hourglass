import * as React from 'react';
import { useState } from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import { NewUser, User } from '../state/user';
import { useTranslation } from 'react-i18next';
import { Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { EditModal } from './EditModal';

export interface UserEditStateProps {
  user: User | NewUser;
  teams: Team[];
  teamStatus: HttpStatus;
}

export interface UserEditDispatchProps {
  setName: (name: string) => {};
  setTeam: (teamId: string) => {};
  addEmail: (email: string) => {};
  removeEmail: (email: string) => {};
  submitEdits: (comment: string) => {};
  cancelEdits: () => {};
  fetchTeams: () => {};
}

export type UserEditProps = UserEditStateProps & UserEditDispatchProps;

export const UserEdit = (props: UserEditProps) => {
  const {t} = useTranslation ();
  const [comment, saveComment] = useState ('');
  const [newEmail, saveNewEmail] = useState ('');

  function submit () {
    props.submitEdits (comment);
  }

  function rename (event: React.ChangeEvent<HTMLInputElement>) {
    props.setName (event.target.value);
  }

  function changeTeam (event: React.ChangeEvent<{value: unknown}>) {
    props.setTeam (event.target.value as string);
  }

  function updateComment (event: React.ChangeEvent<HTMLInputElement>) {
    saveComment (event.target.value);
  }

  function updateNewEmail (event: React.ChangeEvent<{value: unknown}>) {
    saveNewEmail (event.target.value as string);
  }

  function addEmail () {
    props.addEmail (newEmail);
    saveNewEmail ('');
  }

  function title () {
    if ((props.user as User).id) {
      return t ('edit.user.update', props.user);
    } else {
      return t ('edit.user.create');
    }
  }

  function teamSelect () {
    switch (props.teamStatus) {
      case HttpStatus.None:
        props.fetchTeams ();
        return '';
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.teams.length === 0) {
          return t ('teams.none');
        }
        return <Select
            variant="outlined"
            labelId="team-label"
            value={props.user.teamId}
            onChange={changeTeam}>
          <MenuItem value="" disabled>{t ('edit.user.select-team')}</MenuItem>
          {props.teams.map (team =>
              <MenuItem value={team.id} key={team.id}>{team.name}</MenuItem>)}
        </Select>;
      case HttpStatus.Failure:
        return t ('teams.loading-failed');
    }
  }

  function emailEditList () {
    const items = props.user.emails.sort ().map (e => <ListItem key={e}>
      <ListItemText primary={e}/>
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => props.removeEmail (e)}>
          <Delete/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>);
    return <List>{items}</List>;
  }

  return <EditModal title={title ()} cancel={props.cancelEdits} save={submit}>
    <TextField variant="outlined" label={t ('user.name')} fullWidth={true}
        inputProps={{value: props.user.name, onChange: rename}}/>
    <FormControl fullWidth={true}>
      <InputLabel id="team-label">{t ('user.team')}</InputLabel>
      {teamSelect ()}
    </FormControl>
    {emailEditList ()}
    <FormControl variant="outlined" fullWidth={true}>
      <InputLabel htmlFor="new-email">{t ('edit.user.new-email')}</InputLabel>
      <OutlinedInput id="new-email"
          value={newEmail}
          onChange={updateNewEmail}
          type="email" endAdornment={
        <InputAdornment position="end">
          <IconButton edge="end" onClick={addEmail}>
            <Add/>
          </IconButton>
        </InputAdornment>
      }
      />
    </FormControl>
    <TextField variant="outlined" label={t ('edit.comment')} fullWidth={true}
        inputProps={{value: comment, onChange: updateComment}}/>
  </EditModal>;
};
