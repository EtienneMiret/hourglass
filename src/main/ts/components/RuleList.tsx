import * as React from 'react';
import { NewRule, Rule } from '../state/rule';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';

export interface RuleListStateProps {
  prefect: boolean;
  creation: NewRule | null;
  rules: Rule[];
  status: HttpStatus;
}

export interface RuleListDispatchProps {
  fetch: () => {};
}

export type RuleListProps = RuleListStateProps & RuleListDispatchProps;

export const RuleList = (props: RuleListProps) => {
  const {t} = useTranslation ();

  function list () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetch ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.rules.length === 0) {
          return <div>{t ('rules.none')}</div>;
        }
        return <ol>{props.rules.map (rule => <li key={rule.id}>{rule.name}</li>)}</ol>;
      case HttpStatus.Failure:
        return <div>{t ('rules.loading-failed')}</div>;
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetch} key="reload">{
      t ('actions.reload')
    }</button>);

    return <div className="actions">
      {actions}
    </div>;
  }

  return <div className="rule-list">
    {list ()}
    {actions ()}
  </div>;
};
