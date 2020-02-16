import * as React from 'react';
import {Event} from './Home';

export interface HomeEventItemProps {
  event: Event;
}

export const HomeEventItem = (props: HomeEventItemProps) =>
    <tr>
      <td>{props.event.date}</td>
      <td>{props.event.name}</td>
      <td>{props.event.points}</td>
    </tr>;
