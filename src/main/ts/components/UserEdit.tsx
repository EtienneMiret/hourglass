import * as React from 'react';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import { NewUser, User } from '../state/user';
import { useTranslation } from 'react-i18next';
import { Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';

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

  function submit () {
    props.submitEdits (comment);
  }

  function rename (event: React.ChangeEvent<HTMLInputElement>) {
    props.setName (event.target.value);
  }

  function changeTeam (event: React.ChangeEvent<{value: unknown}>) {
    props.setTeam (event.target.value as string);
  }

  function addEmail (event: React.FormEvent<HTMLFormElement>) {
    const input = event
        .currentTarget
        .elements
        .namedItem('email') as HTMLInputElement;
    props.addEmail (input.value);
    event.currentTarget.reset ();
    event.preventDefault ();
  }

  function updateComment (event: React.ChangeEvent<HTMLInputElement>) {
    saveComment (event.target.value);
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
    const items = props.user.emails.sort ().map (e => <li key={e}>{e}
      <button onClick={() => props.removeEmail (e)} type="button">X</button>
    </li>);
    return <ul className="emails">{items}</ul>
  }

  return <Dialog open={true} onClose={props.cancelEdits}>
    <DialogTitle>{title ()}</DialogTitle>
    <DialogContent>
      <TextField variant="outlined" label={t ('user.name')} fullWidth={true}
          inputProps={{value: props.user.name, onChange: rename}}/>
      <FormControl fullWidth={true}>
        <InputLabel id="team-label">{t ('user.team')}</InputLabel>
        {teamSelect ()}
      </FormControl>
      {emailEditList ()}
      <form onSubmit={addEmail}>
        <label>{t ('edit.user.new-email')} <input name="email"/></label>
        <button>+</button>
      </form>
      <TextField variant="outlined" label={t ('edit.comment')} fullWidth={true}
          inputProps={{value: comment, onChange: updateComment}}/>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.cancelEdits}>{t ('edit.cancel')}</Button>
      <Button onClick={submit}>{t ('edit.save')}</Button>
    </DialogActions>
  </Dialog>;
};
