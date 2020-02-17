import * as React from 'react';
import { User } from '../state/user';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';
import { UserEditContainer } from '../containers/user-edit';
import { Team } from '../state/team';
import { Container, List, ListItem, Typography } from '@material-ui/core';
import { AppBar } from './AppBar';
import { ActionBar } from './ActionBar';

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
      return <Typography variant="body1">{t ("user.no-emails")}</Typography>
    } else {
      const items = emails.map (email => <ListItem key={email}>{email}</ListItem>);
      return <List>{items}</List>
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
        return <span style={{color: props.team!.color}}>{props.team!.name}</span>;
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
        return <div>
          <Typography variant="h6">{t ("user.name")}</Typography>
          <Typography variant="body1">{props.user!.name}</Typography>
          <Typography variant="h6">{t ('user.team')}</Typography>
          <Typography variant="body1">{teamName ()}</Typography>
          <Typography variant="h6">{t ("user.emails")}</Typography>
          {emailList (props.user!.emails)}
        </div>;
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

  let edit = undefined;
  if (props.prefect && props.status === HttpStatus.Success) {
    edit = props.editUser;
  }

  function popup () {
    if (!props.prefect || !props.edition) {
      return <div/>;
    }

    return <UserEditContainer user={props.edition}/>
  }

  return <Container className="user-details">
    <AppBar title={props.user?.name || t ('loading')}/>
    <div id="top"/>
    {details ()}
    <ActionBar reload={props.fetchUser} edit={edit}/>
    {popup ()}
  </Container>;
};
