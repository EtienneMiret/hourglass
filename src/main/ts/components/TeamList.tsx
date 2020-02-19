import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NewTeam, Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { TeamEditContainer } from '../containers/team-edit';
import { Link } from 'react-router-dom';
import { Container, List, ListItem, Typography } from '@material-ui/core';
import { AppBar } from './AppBar';
import { ActionBar } from './ActionBar';

export interface TeamListStateProps {
  prefect: boolean;
  creation: NewTeam | null;
  teams: Team[];
  status: HttpStatus;
}

export interface TeamListDispatchProps {
  fetchTeams: () => {};
  startCreate: () => {};
}

export type TeamListProps = TeamListStateProps & TeamListDispatchProps;

export const TeamList = (props: TeamListProps) => {
  const {t} = useTranslation ();

  function list () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetchTeams ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.teams.length === 0) {
          return <Typography variant="body1">{t ('teams.none')}</Typography>;
        }
        return <List>{props.teams.map (team =>
            <ListItem key={team.id}><Link to={`/teams/${team.id}`}>{team.name}</Link></ListItem>)}</List>
      case HttpStatus.Failure:
        return <div>{t ('teams.loading-failed')}</div>;
    }
  }

  let add;
  if (props.prefect && props.status === HttpStatus.Success) {
    add = props.startCreate;
  }

  function popup () {
    if (props.prefect && props.creation) {
      return <TeamEditContainer team={props.creation}/>;
    }

    return <div/>;
  }

  return <Container className="user-list">
    <AppBar title={t ('teams.title')}/>
    <div id="top"/>
    {list ()}
    <ActionBar reload={props.fetchTeams} add={add}/>
    {popup ()}
  </Container>;
};
