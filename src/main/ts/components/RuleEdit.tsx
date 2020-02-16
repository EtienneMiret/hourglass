import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NewRule, Rule } from '../state/rule';

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

  function changePoints (event: React.ChangeEvent<HTMLInputElement>) {
    props.setPoints (Number.parseInt (event.target.value));
  }

  return <div className="rule-edit">
    <label className="name">
      {t ('rule.name')}
      <input value={props.rule.name} onChange={rename}/>
    </label>
    <label className="points">
      {t ('rule.points')}
      <input value={props.rule.points} type="number" onChange={changePoints}/>
    </label>
    <form onSubmit={submit}>
      <label>{t ('edit.comment')} <input name="comment"/></label>
      <button type="button" onClick={props.cancelEdits}>{t ('edit.cancel')}</button>
      <button type="submit">{t ('edit.save')}</button>
    </form>
  </div>;
};
