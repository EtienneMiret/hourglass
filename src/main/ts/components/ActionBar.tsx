import * as React from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IconButton, Toolbar } from '@material-ui/core';

export interface ActionBarProps {
  reload?: () => void;
  add?: () => void;
}

export const ActionBar = (props: ActionBarProps) => {
  const actions = [] as JSX.Element[];

  if (props.reload) {
    actions.push (<IconButton onClick={props.reload} key="reload">
      <ReplayIcon/>
    </IconButton>);
  }

  if (props.add) {
    actions.push (<IconButton onClick={props.add} key="add">
      <AddCircleIcon/>
    </IconButton>);
  }

  return <Toolbar className="actions" style={{top: 'auto', bottom: 0}}>
    {actions}
  </Toolbar>;
};
