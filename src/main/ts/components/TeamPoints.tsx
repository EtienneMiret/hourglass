import * as React from 'react';
import { Team } from './Home';
import { Container, Grid, Typography } from '@material-ui/core';

export interface TeamPointsProps {
  team: Team;
}

export const TeamPoints = (props: TeamPointsProps) => {
  const style = {
    color: props.team.color
  };

  return <Grid item style={style} xs={12} sm={6} md={3} className="team-points">
    <Typography variant="h6">{props.team.name}</Typography>
    <Typography>{props.team.points}</Typography>
  </Grid>;
};
