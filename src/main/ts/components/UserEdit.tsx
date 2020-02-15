import * as React from 'react';
import { NewUser, User } from '../state/user';
import { useTranslation } from 'react-i18next';

export interface UserEditStateProps {
  user: User | NewUser;
}

export interface UserEditDispatchProps {
  setName: (name: string) => {};
  addEmail: (email: string) => {};
  removeEmail: (email: string) => {};
  submitEdits: (comment: string) => {};
  cancelEdits: () => {};
}

export type UserEditProps = UserEditStateProps & UserEditDispatchProps;

export const UserEdit = (props: UserEditProps) => {
  const {t} = useTranslation ();

  function submit (event: React.FormEvent<HTMLFormElement>) {
    const comment = event
        .currentTarget
        .elements
        .namedItem ('comment') as HTMLInputElement;
    props.submitEdits (comment.value);
    event.preventDefault ();
  }

  function rename (event: React.ChangeEvent<HTMLInputElement>) {
    props.setName (event.target.value);
  }

  function addEmail (event: React.FormEvent<HTMLFormElement>) {
    const input = event
        .currentTarget
        .elements
        .namedItem('email') as HTMLInputElement;
    props.addEmail (input.value);
    event.currentTarget.reset ();
    event.preventDefault ();
  }

  function emailEditList () {
    const items = props.user.emails.sort ().map (e => <li key={e}>{e}
      <button onClick={() => props.removeEmail (e)} type="button">X</button>
    </li>);
    return <ul className="emails">{items}</ul>
  }

  return <div className="user-edit">
    <label className="name">
      {t ('user.name')}
      <input value={props.user.name} onChange={rename}/>
    </label>
    {emailEditList ()}
    <form onSubmit={addEmail}>
      <label>{t ('edit.user.new-email')} <input name="email"/></label>
      <button>+</button>
    </form>
    <form onSubmit={submit}>
      <label>{t ('edit.comment')} <input name="comment"/></label>
      <button type="button" onClick={props.cancelEdits}>{t ('edit.cancel')}</button>
      <button type="submit">{t ('edit.save')}</button>
    </form>
  </div>;
};
