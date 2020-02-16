import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import { NewUser, User } from '../state/user';
import { useTranslation } from 'react-i18next';
import { Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { useState } from 'react';

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

  function changeTeam (event: React.ChangeEvent<HTMLSelectElement>) {
    props.setTeam (event.target.value);
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
        return <select value={props.user.teamId} onChange={changeTeam}>
          <option value="">{t ('edit.user.select-team')}</option>
          {props.teams.map (team =>
              <option value={team.id} key={team.id}>{team.name}</option>)}
        </select>;
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
      <label className="team">
        {t ('user.team')}
        {teamSelect ()}
      </label>
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
