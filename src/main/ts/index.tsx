import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/App';
import { applyMiddleware, createStore, Action, compose } from 'redux';
import { reducers } from './reducers';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { GlobalState } from './state';
import { fetchWhoAmI } from './actions/who-am-i';

import './i18n';

const devCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore (
    reducers,
    devCompose (applyMiddleware (thunk as ThunkMiddleware<GlobalState, Action>))
);

store.dispatch (fetchWhoAmI () as unknown as Action);

ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root')
);
