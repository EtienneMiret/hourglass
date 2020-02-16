import * as React from 'react';
import { Rule } from '../state/rule';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';
import { RuleEditContainer } from '../containers/rule-edit';

export interface RuleDetailsStateProps {
  prefect: boolean;
  rule?: Rule;
  edition?: Rule;
  status: HttpStatus;
}

export interface RuleDetailsDispatchProps {
  edit: () => {};
  fetch: () => {};
}

export type RuleDetailsProps = RuleDetailsStateProps & RuleDetailsDispatchProps;

export const RuleDetails = (props: RuleDetailsProps) => {
  const {t} = useTranslation ();

  function details () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetch ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        return <dl>
          <div className="name">
            <dt>{t ('rule.name')}</dt>
            <dd>{props.rule!.name}</dd>
          </div>
          <div className="points">
            <dt>{t ('rule.points')}</dt>
            <dd>{props.rule!.points}</dd>
          </div>
        </dl>;
      case HttpStatus.Failure:
        return <div>{t ('rule.loading-failed')}</div>;
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetch} key="reload">{
      t ('actions.reload')
    }</button>);

    if (props.prefect && props.status === HttpStatus.Success) {
      actions.push (<button onClick={props.edit} key="edit">{
        t ('actions.edit')
      }</button>);
    }

    return <div className="actions">{actions}</div>;
  }

  function popup () {
    if (props.prefect && props.edition) {
      return <RuleEditContainer rule={props.edition}/>;
    }

    return <div/>;
  }

  return <div className="rule-details">
    {details ()}
    {actions ()}
    {popup ()}
  </div>;
};
