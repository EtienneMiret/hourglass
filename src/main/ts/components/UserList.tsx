import * as React from 'react';
import { NewUser, User } from '../state/user';
import { Event } from '../state/event';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { useTranslation } from 'react-i18next';
import { UserEditContainer } from '../containers/user-edit';
import { Team } from '../state/team';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface UserDisplay {
  id: string;
  name: string;
  team: string;
  color: string;
  points: number;
}

enum OrderProp {
  name,
  points,
  team
}

export interface UserListStateProps {
  prefect: boolean;
  creation: NewUser | null;
  users: User[];
  status: HttpStatus;
  events: Event[];
  eventStatus: HttpStatus;
  teams: Team[];
  teamStatus: HttpStatus;
}

export interface UserListDispatchProps {
  fetchUsers: () => {};
  fetchEvents: () => {};
  fetchTeams: () => {};
  startCreate: () => {};
}

export type UserListProps = UserListStateProps & UserListDispatchProps;

export const UserList = (props: UserListProps) => {
  const {t} = useTranslation ();
  const [orderProp, setOrder] = useState(OrderProp.name);
  const [asc, setAsc] = useState (true);

  function compare (a: UserDisplay, b: UserDisplay) {
    let res: number;
    switch (orderProp) {
      case OrderProp.name:
        res = a.name.localeCompare (b.name);
        break;
      case OrderProp.points:
        res = a.points - b.points;
        break;
      case OrderProp.team:
        res = a.team.localeCompare (b.team);
        break;
    }
    if (res === 0) {
      res = a.name.localeCompare (b.name);
    }
    if (res === 0) {
      res = a.id.localeCompare (b.id);
    }
    return asc ? res : -res;
  }

  function changeSort (order: OrderProp) {
    if (orderProp === order) {
      setAsc (!asc);
    } else {
      setOrder (order);
      setAsc (true);
    }
  }

  if (props.status === HttpStatus.None) {
    props.fetchUsers ();
  }
  if (props.eventStatus === HttpStatus.None) {
    props.fetchEvents ();
  }
  if (props.teamStatus === HttpStatus.None) {
    props.fetchTeams ();
  }

  const teamMap = new Map<string, Team> ();
  props.teams.forEach (t => teamMap.set (t.id, t));

  const userMap = new Map<string, UserDisplay> ();
  props.users.forEach (u => {
    const team = teamMap.get (u.teamId);
    userMap.set (u.id, {
      id: u.id,
      name: u.name,
      team: team?.name || '',
      color: team?.color || 'inherit',
      points: 0
    })
  });

  props.events.forEach (event => {
    event.userIds
        .map (id => userMap.get (id))
        .filter (u => u)
        .forEach (u => u!.points += event.points);
  });

  const users = Array.from (userMap.values ());
  users.sort (compare);

  function list () {
    switch (props.status) {
      case HttpStatus.None:
        props.fetchUsers ();
        return <div/>;
      case HttpStatus.Progressing:
        return <Loader/>;
      case HttpStatus.Success:
        if (users.length === 0) {
          return <div>{t('users.none')}</div>
        }
        return <table>
          <thead>
            <tr>
              <th onClick={() => changeSort (OrderProp.name)}>{t ('user.name')}</th>
              <th onClick={() => changeSort (OrderProp.team)}>{t ('user.team')}</th>
              <th onClick={() => changeSort (OrderProp.points)}>{t ('user.points')}</th>
            </tr>
          </thead>
          <tbody>
          {users.map (user => {
            const style = {color: user.color};

            return <tr key={user.id}><Link to={`/users/${user.id}`} style={style}>
              <td>{user.name}</td>
              <td>{user.team}</td>
              <td>{user.points}</td>
            </Link></tr>;
          })}
          </tbody>
        </table>;
      case HttpStatus.Failure:
        return <div>{t('users.loading-failed')}</div>
    }
  }

  function actions () {
    const actions: JSX.Element[] = [];
    actions.push (<button onClick={props.fetchUsers} key="reload">{t ('actions.reload')}</button>);

    if (props.prefect && props.status === HttpStatus.Success) {
      actions.push (<button onClick={props.startCreate} key="create">{t ('actions.add')}</button>);
    }

    return <div className="actions">
      {actions}
    </div>;
  }

  function popup () {
    if (props.prefect && props.creation) {
      return <UserEditContainer user={props.creation}/>;
    }

    return <div/>;
  }

  return <div className="user-list">
    {list ()}
    {actions ()}
    {popup ()}
  </div>;
};
