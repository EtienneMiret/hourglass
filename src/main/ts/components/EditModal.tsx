import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export interface EditModalProps {
  title: string;
  children: any;
  cancel: () => void;
  save: () => void;
}

export const EditModal = (props: EditModalProps) => {
  const {t} = useTranslation ();

  return <Dialog open={true}
      onClose={props.cancel} className="edit-modal">
    <DialogTitle>{props.title}</DialogTitle>
    <DialogContent>
      {props.children}
    </DialogContent>
    <DialogActions>
      <Button onClick={props.cancel}>{t ('edit.cancel')}</Button>
      <Button onClick={props.save}>{t ('edit.save')}</Button>
    </DialogActions>
  </Dialog>;
};
