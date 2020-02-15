import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NewTeam, Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';

export interface TeamListStateProps {
  prefect: boolean;
  creation: NewTeam | null;
  teams: Team[];
  status: HttpStatus;
}

export interface TeamListDispatchProps {
  fetchTeams: () => {};
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
        return <ol>{props.teams.map (team => <li key={team.id}>{team.name}</li>)}</ol>
      case HttpStatus.Failure:
        return <div>{t ('teams.loading-failed')}</div>;
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetchTeams} key="reload">{t ('actions.reload')}</button>);

    return <div className="actions">
      {actions}
    </div>;
  }

  return <div className="user-list">
    {list ()}
    {actions ()}
  </div>;
};
