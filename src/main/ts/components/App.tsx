import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as React from 'react';
import { Hello } from './Hello';
import { GlobalState } from '../state/global';
import { AnyAction, Store } from 'redux';

const MyHello = () => <Hello compiler="TypeScript" framework="Redux/React"/>;

export const App = ({store}: {store: Store<GlobalState, AnyAction>}) => (
    <Provider store={store}>
      <Router>
        <Route path="/" component={MyHello} />
      </Router>
    </Provider>
);
