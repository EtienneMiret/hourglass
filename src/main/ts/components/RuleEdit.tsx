import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NewRule, Rule } from '../state/rule';
import { EditModal } from './EditModal';
import { TextField } from '@material-ui/core';
import { useState } from 'react';

export interface RuleEditStateProps {
  rule: Rule | NewRule;
}

export interface RuleEditDispatchProps {
  setName: (name: string) => {};
  setPoints: (points: number) => {};
  submitEdits: (comment: string) => {};
  cancelEdits: () => {};
}

export type RuleEditProps = RuleEditStateProps & RuleEditDispatchProps;

export const RuleEdit = (props: RuleEditProps) => {
  const {t} = useTranslation ();
  const [comment, saveComment] = useState ('');

  function submit () {
    props.submitEdits (comment);
  }

  function rename (event: React.ChangeEvent<{value: unknown}>) {
    props.setName (event.target.value as string);
  }

  function changePoints (event: React.ChangeEvent<{value: unknown}>) {
    props.setPoints (Number.parseInt (event.target.value as string));
  }

  function updateComment (event: React.ChangeEvent<{value: unknown}>) {
    saveComment (event.target.value as string);
  }

  function title () {
    if ((props.rule as Rule).id) {
      return t ('edit.rule.update', props.rule);
    } else {
      return t ('edit.rule.create');
    }
  }

  return <EditModal title={title ()} cancel={props.cancelEdits} save={submit}>
    <TextField variant="outlined" label={t ('rule.name')} fullWidth={true}
        value={props.rule.name} onChange={rename}/>
    <TextField variant="outlined" label={t ('rule.points')} fullWidth={true}
        value={props.rule.points} onChange={changePoints}/>
    <TextField variant="outlined" label={t ('edit.comment')} fullWidth={true}
      value={comment} onChange={updateComment}/>
  </EditModal>;
};
