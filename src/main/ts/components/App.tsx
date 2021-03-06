import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as React from 'react';
import { Suspense } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { GlobalState } from '../state';
import { AnyAction, Store } from 'redux';
import { UserListContainer } from '../containers/user-list';
import { Loader } from './Loader';
import { UserDetailsContainer } from '../containers/user-details';
import { TeamListContainer } from '../containers/team-list';
import { TeamDetailsContainer } from '../containers/team-details';
import { RuleListContainer } from '../containers/rule-list';
import { RuleDetailsContainer } from '../containers/rule-details';
import { EventListContainer } from '../containers/event-list';
import { EventDetailsContainer } from '../containers/event-details';
import { HomeContainer } from '../containers/home';

export const App = ({store}: {store: Store<GlobalState, AnyAction>}) => (
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
      <Suspense fallback={<Loader/>}>
        <Router>
          <Switch>
            <Route path="/rules/:ruleId" component={RuleDetailsContainer}/>
            <Route path="/rules" component={RuleListContainer}/>
            <Route path="/events/:eventId" component={EventDetailsContainer}/>
            <Route path="/events" component={EventListContainer}/>
            <Route path="/users/:userId" component={UserDetailsContainer}/>
            <Route path="/users" component={UserListContainer}/>
            <Route path="/teams/:teamId" component={TeamDetailsContainer}/>
            <Route path="/teams" component={TeamListContainer}/>
            <Route path="/load" component={Loader}/>
            <Route path="/" component={HomeContainer}>
            </Route>
          </Switch>
        </Router>
      </Suspense>
      </MuiPickersUtilsProvider>
    </Provider>
);
