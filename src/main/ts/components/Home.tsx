import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HttpStatus } from '../state/status';
import { Loader } from './Loader';
import { TeamPoints } from './TeamPoints';
import { HomeEventItem } from './HomeEventItem';
import { Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { AppBar } from './AppBar';

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
      return <Container>
        <AppBar title={t ('home.hello', props.me)}/>
        <section className="my-points">
          <h1>{t ('home.my-points')}</h1>
          <p>{props.myPoints}</p>
        </section>
        <Grid container>
          {props.teams.map (team => <TeamPoints team={team} key={team.id}/>)}
        </Grid>
        <TableContainer className="my-events">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t ('home.events.date')}</TableCell>
                <TableCell>{t ('home.events.name')}</TableCell>
                <TableCell>{t ('home.events.points')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { props.myEvents.sort(compareEvent)
                  .map(event => <HomeEventItem event={event} key={event.id}/>)}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>;
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
