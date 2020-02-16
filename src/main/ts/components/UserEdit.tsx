import * as React from 'react';
import { Dialog } from '@material-ui/core';
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

  return <Dialog open={true} onClose={props.cancelEdits}><div className="user-edit">
    <label className="name">
      {t ('user.name')}
      <input value={props.user.name} onChange={rename}/>
    </label>
    <label className="team">
      {t ('user.team')}
      {teamSelect ()}
    </label>
    {emailEditList ()}
    <form onSubmit={addEmail}>
      <label>{t ('edit.user.new-email')} <input name="email"/></label>
      <button>+</button>
    </form>
    <form onSubmit={submit}>
      <label>{t ('edit.comment')} <input name="comment"/></label>
      <button type="button" onClick={props.cancelEdits}>{t ('edit.cancel')}</button>
      <button type="submit">{t ('edit.save')}</button>
    </form>
  </div></Dialog>;
};
