import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { TeamEditContainer } from '../containers/team-edit';
import { Container } from '@material-ui/core';
import { AppBar } from './AppBar';
import { ActionBar } from './ActionBar';
import { Details, DetailsItem } from './Details';

export interface TeamDetailsStateProps {
  prefect: boolean;
  team?: Team;
  edition?: Team;
  status: HttpStatus;
}

export interface TeamDetailsDispatchProps {
  edit: () => {};
  fetch: () => {};
}

export type TeamDetailsProps = TeamDetailsStateProps & TeamDetailsDispatchProps;

export const TeamDetails = (props: TeamDetailsProps) => {
  const {t} = useTranslation ();

  function details () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetch ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        const style = {color: props.team!.color};
        const items: DetailsItem[] = [
          {
            id: 'name',
            title: t ('team.name'),
            value: props.team!.name
          },
          {
            id: 'color',
            title: t ('team.color'),
            value: <span style={style}>{props.team!.color}</span>
          }
        ];
        return <Details items={items}/>
      case HttpStatus.Failure:
        return <div>{t ('team.loading-failed')}</div>;
    }
  }

  let edit;
  if (props.prefect && props.status === HttpStatus.Success) {
    edit = props.edit;
  }

  function poupup () {
    if (props.prefect && props.edition) {
      return <TeamEditContainer team={props.edition}/>;
    }

    return <div/>;
  }

  return <Container className="team-details">
    <AppBar title={props.team?.name || t ('loading')}/>
    <div id="top"/>
    {details ()}
    <ActionBar reload={props.fetch} edit={edit}/>
    {poupup ()}
  </Container>;
};
