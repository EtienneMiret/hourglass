import * as React from 'react';
import { User } from '../state/user';
import { HttpStatus } from '../state/status';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';
import { ChangeEvent, FormEvent } from 'react';

export interface UserDetailsStateProps {
  prefect: boolean;
  user?: User;
  edition?: User;
  status: HttpStatus;
}

export interface UserDetailsDispatchProps {
  editUser: () => {};
  setName: (name: string) => {};
  addEmail: (email: string) => {};
  removeEmail: (email: string) => {};
  submitEdits: (user: User, comment: string) => {};
  cancelEdits: () => {};
  fetchUser: () => {};
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

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetchUser} key="reload">{t ("reload")}</button>);

    if (props.prefect && props.status == HttpStatus.Success) {
      actions.push (<button onClick={props.editUser} key="edit">{t ('edit')}</button>);
    }

    return <div className="actions">
      {actions}
    </div>;
  }

  function popup () {
    if (!props.prefect || !props.edition) {
      return <div/>;
    }

    function submit (event: FormEvent<HTMLFormElement>) {
      const comment =
          event.currentTarget.elements.namedItem ('comment') as HTMLInputElement;
      props.submitEdits (props.edition!, comment.value);
      event.preventDefault ();
    }

    function rename (event: ChangeEvent<HTMLInputElement>) {
      props.setName (event.target.value);
    }

    function addEmail () {
      const input = document.getElementById ('new-email') as HTMLInputElement;
      props.addEmail (input.value);
    }

    function emailEditList (emails: string[]) {
      if (emails.length === 0) {
        return <div/>;
      } else {
        const items = emails.sort ().map (e => <li key={e}>{e}
          <button onClick={() => props.removeEmail (e)} type="button">X</button>
        </li>);
        return <ul>{items}</ul>
      }
    }

    return <form onSubmit={submit}>
      <div className="name">
        <label>
          {t ('user.name')}
          <input value={props.edition.name} onChange={rename}/>
        </label>
      </div>
      <div className="emails">
        {emailEditList (props.edition.emails)}
        <div className="new">
          <label>{t ('user.edit.new-email')}<input id="new-email" type="email"/></label>
          <button onClick={addEmail} type="button">+</button>
        </div>
      </div>
      <label>{t ('edit.comment')} <input name="comment"/></label>
      <button type="button" onClick={props.cancelEdits}>{t ('edit.cancel')}</button>
      <button type="submit">{t ('edit.save')}</button>
    </form>;
  }

  return <div className="user-details">
    {details ()}
    {actions ()}
    {popup ()}
  </div>;
};
