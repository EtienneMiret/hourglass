import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Team } from '../state/team';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { TeamEditContainer } from '../containers/team-edit';

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
        return <dl>
          <div className="name">
            <dt>{t ('team.name')}</dt>
            <dd>{props.team!.name}</dd>
          </div>
          <div className="color">
            <dt>{t ('team.color')}</dt>
            <dd style={style}>{props.team!.color}</dd>
          </div>
        </dl>;
      case HttpStatus.Failure:
        return <div>{t ('team.loading-failed')}</div>;
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

    return <div className="actions">
      {actions}
    </div>;
  }

  function poupup () {
    if (props.prefect && props.edition) {
      return <TeamEditContainer team={props.edition}/>;
    }

    return <div/>;
  }

  return <div className="team-details">
    {details ()}
    {actions ()}
    {poupup ()}
  </div>;
};
