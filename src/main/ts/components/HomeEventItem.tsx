import * as React from 'react';
import { Event } from '../state/event';
import { TableCell, TableRow } from '@material-ui/core';

export interface HomeEventItemProps {
  event: Event;
}

export const HomeEventItem = (props: HomeEventItemProps) =>
    <TableRow>
      <TableCell>{props.event.date}</TableCell>
      <TableCell>{props.event.name}</TableCell>
      <TableCell>{props.event.points}</TableCell>
    </TableRow>;
