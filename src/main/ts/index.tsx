import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/App';
import { createStore } from 'redux';

const store = createStore (() => {
  return {};
});

ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root')
);
