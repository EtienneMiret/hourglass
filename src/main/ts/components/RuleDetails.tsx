import * as React from 'react';
import { Rule } from '../state/rule';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';
import { RuleEditContainer } from '../containers/rule-edit';
import { Container } from '@material-ui/core';
import { AppBar } from './AppBar';
import { ActionBar } from './ActionBar';
import { Details, DetailsItem } from './Details';

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
        const items: DetailsItem[] = [
          {
            id: 'name',
            title: t ('rule.name'),
            value: props.rule!.name
          },
          {
            id: 'points',
            title: t ('rule.points'),
            value: props.rule!.points.toString ()
          }
        ];
        return <Details items={items}/>;
      case HttpStatus.Failure:
        return <div>{t ('rule.loading-failed')}</div>;
    }
  }

  let edit;
  if (props.prefect && props.status === HttpStatus.Success) {
    edit = props.edit;
  }

  function popup () {
    if (props.prefect && props.edition) {
      return <RuleEditContainer rule={props.edition}/>;
    }

    return <div/>;
  }

  return <Container className="rule-details">
    <AppBar title={props.rule?.name || t ('loading')}/>
    <div id="top"/>
    {details ()}
    <ActionBar reload={props.fetch} edit={edit}/>
    {popup ()}
  </Container>;
};
