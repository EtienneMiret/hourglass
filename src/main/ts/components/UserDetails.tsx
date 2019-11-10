import * as React from 'react';
import { User } from '../state/user';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';

export interface UserDetailsStateProps {
  user?: User,
  status: HttpStatus
}

export interface UserDetailsDispatchProps {
  fetchUser: () => {}
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

  function details () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetchUser ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        return <dl>
          <div className="name">
            <dt>{t ("user.name")}</dt>
            <dd>{props.user!.name}</dd>
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

  return <div className="user-details">
    {details ()}
    <button onClick={props.fetchUser}>{t ("reload")}</button>
  </div>;
};
