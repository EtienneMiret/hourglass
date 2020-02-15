import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NewTeam, Team } from '../state/team';

export interface TeamEditStateProps {
  team: Team | NewTeam;
}

export interface TeamEditDispatchProps {
  setName: (name: string) => {};
  setColor: (color: string) => {};
  submitEdits: (comment: string) => {};
  cancelEdits: () => {};
}

export type TeamEditProps = TeamEditStateProps & TeamEditDispatchProps;

export const TeamEdit = (props: TeamEditProps) => {
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

  function changeColor (event: React.ChangeEvent<HTMLInputElement>) {
    props.setColor (event.target.value);
  }

  return <div className="team-edit">
    <label className="name">
      {t ('team.name')}
      <input value={props.team.name} onChange={rename}/>
    </label>
    <label className="color">
      {t ('team.color')}
      <input type="color" value={props.team.color} onChange={changeColor}/>
    </label>
    <form onSubmit={submit}>
      <label>{t ('edit.comment')} <input name="comment"/></label>
      <button type="button" onClick={props.cancelEdits}>{t ('edit.cancel')}</button>
      <button type="submit">{t ('edit.save')}</button>
    </form>
  </div>;
};
