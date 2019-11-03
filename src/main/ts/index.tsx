import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/App';
import { applyMiddleware, createStore, Action } from 'redux';
import { reducers } from './reducers';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { fetchUsers } from './actions/users';
import { GlobalState } from './state';


const store = createStore (
    reducers,
    applyMiddleware (thunk as ThunkMiddleware<GlobalState, Action>)
);

store.dispatch (fetchUsers ());

ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root')
);
