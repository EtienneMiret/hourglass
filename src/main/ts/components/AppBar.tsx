import * as React from 'react';
import { AppBar as MuiAppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface AppBarProps {
  title: string;
}

export const AppBar = (props: AppBarProps) => {
  const {t} = useTranslation ();
  const [open, setOpen] = useState (false);

  return <MuiAppBar className="app-bar">
    <Toolbar>
      <IconButton edge="start" onClick={() => setOpen (true)} id="menu"><MenuIcon/></IconButton>
      <Menu open={open} onClose={() => setOpen (false)}
          anchorEl={document.getElementById ('menu')}>
        <MenuItem><Link to="/">{t ('nav.home')}</Link></MenuItem>
        <MenuItem><Link to="/teams/">{t ('nav.teams')}</Link></MenuItem>
        <MenuItem><Link to="/users/">{t ('nav.users')}</Link></MenuItem>
        <MenuItem><Link to="/events/">{t ('nav.events')}</Link></MenuItem>
        <MenuItem><Link to="/rules/">{t ('nav.rules')}</Link></MenuItem>
      </Menu>
      <Typography variant="h6">{props.title}</Typography>
    </Toolbar>
  </MuiAppBar>;
};
