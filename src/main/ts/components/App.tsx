import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as React from 'react';
import { Suspense } from 'react';
import { Hello } from './Hello';
import { GlobalState } from '../state';
import { AnyAction, Store } from 'redux';
import { UserListContainer } from '../containers/user-list';
import { Loader } from './Loader';
import { UserDetailsContainer } from '../containers/user-details';

export const App = ({store}: {store: Store<GlobalState, AnyAction>}) => (
    <Provider store={store}>
      <Suspense fallback={<Loader/>}>
        <Router>
          <Switch>
            <Route path="/users/:userId" component={UserDetailsContainer}/>
            <Route path="/users" component={UserListContainer}/>
            <Route path="/load" component={Loader}/>
            <Route path="/">
              <Hello compiler="TypeScript" framework="Redux/React"/>
            </Route>
          </Switch>
        </Router>
      </Suspense>
    </Provider>
);
