import * as React from 'react';
import {
  Container,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { NewRule, Rule } from '../state/rule';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';
import { RuleEditContainer } from '../containers/rule-edit';
import { AppBar } from './AppBar';
import { ActionBar } from './ActionBar';

export interface RuleListStateProps {
  prefect: boolean;
  creation: NewRule | null;
  rules: Rule[];
  status: HttpStatus;
}

export interface RuleListDispatchProps {
  fetch: () => {};
  startCreate: () => {};
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
          return <Typography variant="body1">{t ('rules.none')}</Typography>;
        }
        return <TableContainer><Table>
          <TableHead>
            <TableRow>
              <TableCell>{t ('rule.name')}</TableCell>
              <TableCell>{t ('rule.points')}</TableCell>
            </TableRow>
          </TableHead>
          {props.rules.map (rule =>
              <TableRow key={rule.id}>
                <Link to={`/rules/${rule.id}`}>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{rule.points}</TableCell>
                </Link>
              </TableRow>
          )}
        </Table></TableContainer>;
      case HttpStatus.Failure:
        return <div>{t ('rules.loading-failed')}</div>;
    }
  }

  let add = undefined;
  if (props.prefect && props.status === HttpStatus.Success) {
    add = props.startCreate;
  }

  function popup () {
    if (props.prefect && props.creation) {
      return <RuleEditContainer rule={props.creation}/>
    }
    return <div/>
  }

  return <Container className="rule-list">
    <AppBar title={t ('rules.title')}/>
    <div id="top"/>
    {list ()}
    <ActionBar reload={props.fetch} add={add}/>
    {popup ()}
  </Container>;
};
