import * as React from 'react';
import { User } from '../state/user';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';
import { UserEditContainer } from '../containers/user-edit';
import { Team } from '../state/team';

export interface UserDetailsStateProps {
  prefect: boolean;
  user?: User;
  edition?: User;
  status: HttpStatus;
  team?: Team;
  teamStatus?: HttpStatus;
}

export interface UserDetailsDispatchProps {
  editUser: () => {};
  fetchUser: () => {};
  fetchTeam: (teamId: string) => {};
}

export type UserDetailsProps = UserDetailsStateProps & UserDetailsDispatchProps;

export const UserDetails = (props: UserDetailsProps) => {
  const {t} = useTranslation ();

  function emailList (emails: string[]) {
    if (emails.length === 0) {
      return <span>{t ("user.no-emails")}</span>
    } else {
      const items = emails.map (email => <li key={email}>{email}</li>);
      return <ol>{items}</ol>
    }
  }

  function teamName () {
    switch (props.teamStatus) {
      case undefined:
      case HttpStatus.None:
        return '';
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        return props.team!.name;
      case HttpStatus.Failure:
        return t ('user.team-loading-failed');
    }
  }

  function details () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetchUser ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (props.teamStatus === HttpStatus.None) {
          props.fetchTeam (props.user!.teamId);
        }
        return <dl>
          <div className="name">
            <dt>{t ("user.name")}</dt>
            <dd>{props.user!.name}</dd>
          </div>
          <div className="team">
            <dt>{t ('user.team')}</dt>
            <dd>{teamName ()}</dd>
          </div>
          <div className="emails">
            <dt>{t ("user.emails")}</dt>
            <dd>{emailList (props.user!.emails)}</dd>
          </div>
        </dl>;
      case HttpStatus.Failure:
        return <div>{t ("user.loading-failed")}</div>
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetchUser} key="reload">{t ('actions.reload')}</button>);

    if (props.prefect && props.status == HttpStatus.Success) {
      actions.push (<button onClick={props.editUser} key="edit">{t ('actions.edit')}</button>);
    }

    return <div className="actions">
      {actions}
    </div>;
  }

  function popup () {
    if (!props.prefect || !props.edition) {
      return <div/>;
    }

    return <UserEditContainer user={props.edition}/>
  }

  return <div className="user-details">
    {details ()}
    {actions ()}
    {popup ()}
  </div>;
};
