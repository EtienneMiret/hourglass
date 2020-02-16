import * as React from 'react';
import { Team } from './Home';
import { useTranslation } from 'react-i18next';

export interface TeamPointsProps {
  team: Team;
}

export const TeamPoints = (props: TeamPointsProps) => {
  const {t} = useTranslation ();
  const style = {
    color: props.team.color
  };

  return <section className="team" style={style}>
    <h1>{props.team.name}</h1>
    <p>{props.team.points}</p>
  </section>;
};
