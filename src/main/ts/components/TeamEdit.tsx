import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { EditModal } from './EditModal';
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
  const [comment, saveComment] = useState ('');

  function submit () {
    props.submitEdits (comment);
  }

  function rename (event: React.ChangeEvent<HTMLInputElement>) {
    props.setName (event.target.value);
  }

  function changeColor (event: React.ChangeEvent<HTMLInputElement>) {
    props.setColor (event.target.value);
  }

  function updateComment (event: React.ChangeEvent<{value: string}>) {
    saveComment (event.target.value);
  }

  function title () {
    if ((props.team as Team).id) {
      return t ('edit.team.update', props.team);
    } else {
      return t ('edit.team.create');
    }
  }

  return <EditModal title={title ()} cancel={props.cancelEdits} save={submit}>
    <TextField variant="outlined" label={t ('team.name')} fullWidth={true}
        value={props.team.name} onChange={rename}/>
    <TextField variant="outlined" label={t ('team.color')} fullWidth={true}
        value={props.team.color} onChange={changeColor} type="color"/>
    <TextField variant="outlined" label={t ('edit.comment')} fullWidth={true}
        value={comment} onChange={updateComment}/>
  </EditModal>;
};
