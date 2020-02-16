import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { TeamPoints } from './TeamPoints';
import { HomeEventItem } from './HomeEventItem';

export interface User {
  id: string;
  teamId: string;
  name: string;
  prefect: boolean;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  points: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  points: number;
}

export interface HomeStateProps {
  myPoints: number;
  myEvents: Event[];
  teams: Team[];
  me: User;
  userStatus: HttpStatus;
  eventStatus: HttpStatus;
  teamStatus: HttpStatus;
  whoAmIStatus: HttpStatus;
}

export interface HomeDispatchProps {
  fetchUsers: () => void;
  fetchEvents: () => void;
  fetchTeams: () => void;
  fetchWhoAmI: () => void;
}

export type HomeProps = HomeStateProps & HomeDispatchProps;

export const Home = (props: HomeProps) => {
  const {t} = useTranslation ();

  if (props.userStatus === HttpStatus.None) {
    props.fetchUsers ();
  }
  if (props.eventStatus === HttpStatus.None) {
    props.fetchEvents ();
  }
  if (props.teamStatus === HttpStatus.None) {
    props.fetchTeams ();
  }
  if (props.whoAmIStatus === HttpStatus.None) {
    props.fetchWhoAmI ();
  }

  const combined = combine(
      props.userStatus,
      props.eventStatus,
      props.teamStatus,
      props.whoAmIStatus
  );
  switch (combined) {
    case HttpStatus.None:
      return <div/>;
    case HttpStatus.Progressing:
      return <Loader/>;
    case HttpStatus.Success:
      return <div>
        <section className="hello">{t ('home.hello', props.me)}</section>
        <section className="my-points">
          <h1>{t ('home.my-points')}</h1>
          <p>{props.myPoints}</p>
        </section>
        <section className="team-points">
          {props.teams.map (team => <TeamPoints team={team} key={team.id}/>)}
        </section>
        <section className="my-events">
          <table>
            <thead>
              <tr>
                <th>{t ('home.events.date')}</th>
                <th>{t ('home.events.name')}</th>
                <th>{t ('home.events.points')}</th>
              </tr>
            </thead>
            <tbody>
              { props.myEvents.sort(compareEvent)
                  .map(event => <HomeEventItem event={event} key={event.id}/>)}
            </tbody>
          </table>
        </section>
      </div>;
    case HttpStatus.Failure:
      return <div>{t ('home.loading-failed')}</div>;
  }
};

function compareEvent (a: Event, b: Event): number {
  const dateComparison = a.date.localeCompare (b.date);
  if (dateComparison == 0) {
    return a.name.localeCompare (b.name);
  }
  return dateComparison;
}

function combine (...statuses: HttpStatus[]): HttpStatus {
  const ordered = [
    HttpStatus.Failure,
    HttpStatus.None,
    HttpStatus.Progressing,
    HttpStatus.Success
  ];
  for (const status of ordered) {
    if (statuses.includes (status)) {
      return status;
    }
  }
  return HttpStatus.None;
}
