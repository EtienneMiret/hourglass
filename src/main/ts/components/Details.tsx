import * as React from 'react';
import { Typography } from '@material-ui/core';

export interface DetailsItem {
  id: string;
  title: string;
  value: JSX.Element | string;
}

export interface DetailsProps {
  items: DetailsItem[];
}

export const Details = (props: DetailsProps) => <div className="details">
  {props.items.map (item => <div key={item.id}>
    <Typography variant="h6">{item.title}</Typography>
    <Typography variant="body1">{item.value}</Typography>
  </div>)}
</div>;
