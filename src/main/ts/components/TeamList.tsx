import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NewTeam, Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { TeamEditContainer } from '../containers/team-edit';
import { Link } from 'react-router-dom';

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
          return <div>{t ('teams.none')}</div>;
        }
        return <ol>{props.teams.map (team =>
            <li key={team.id}><Link to={`/teams/${team.id}`}>{team.name}</Link></li>)}</ol>
      case HttpStatus.Failure:
        return <div>{t ('teams.loading-failed')}</div>;
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetchTeams} key="reload">{t ('actions.reload')}</button>);

    if (props.prefect && props.status === HttpStatus.Success) {
      actions.push (<button onClick={props.startCreate} key="create">{t ('actions.add')}</button>);
    }

    return <div className="actions">
      {actions}
    </div>;
  }

  function popup () {
    if (props.prefect && props.creation) {
      return <TeamEditContainer team={props.creation}/>;
    }

    return <div/>;
  }

  return <div className="user-list">
    {list ()}
    {actions ()}
    {popup ()}
  </div>;
};
