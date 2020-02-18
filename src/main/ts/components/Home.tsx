import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HttpStatus } from '../state/status';
import { Event } from '../state/event';
import { Loader } from './Loader';
import { TeamPoints } from './TeamPoints';
import { HomeEventItem } from './HomeEventItem';
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { AppBar } from './AppBar';
import { combine, compareEvent } from '../lib/utils';

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
      return <Container className="home">
        <AppBar title={t ('home.hello', props.me)}/>
        <div id="top"/>
        <section>
          <Typography variant="h2">{t ('home.team-points')}</Typography>
          <Grid container>
            {props.teams.map (team => <TeamPoints team={team} key={team.id}/>)}
          </Grid>
        </section>
        <section>
          <Typography variant="h2">{t ('home.my-points.title')}</Typography>
          <Typography variant="h3">{t ('home.my-points.value', props)}</Typography>
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
                {props.myEvents.sort (compareEvent)
                    .map (event => <HomeEventItem event={event} key={event.id}/>)}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </Container>;
    case HttpStatus.Failure:
      return <div>{t ('home.loading-failed')}</div>;
  }
};
