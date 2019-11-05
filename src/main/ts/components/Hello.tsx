import * as React from 'react';
import { useTranslation } from 'react-i18next';

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => {
  const {t} = useTranslation ();

  return <h1>{t ('hello', props)}</h1>;
};
