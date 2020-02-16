import { connect } from 'react-redux';
import { GlobalState } from '../state';
import {
  Home,
  HomeDispatchProps,
  HomeStateProps,
  Team
} from '../components/Home';
import { fetchUsers } from '../actions/users';
import { fetchEvents } from '../actions/events';
import { fetchTeams } from '../actions/teams';
import { fetchWhoAmI } from '../actions/who-am-i';
import { HttpStatus } from '../state/status';

function mapStateToProps (state: GlobalState): HomeStateProps {
  if (state.whoami.status !== HttpStatus.Success
      || state.events.status !== HttpStatus.Success
      || state.users.status !== HttpStatus.Success
      || state.teams.status !== HttpStatus.Success
  ) {
    return {
      myPoints: 0,
      myEvents: [],
      teams: [],
      me: {
        id: '',
        teamId: '',
        name: 'unknown',
        prefect: false
      },
      userStatus: state.users.status,
      eventStatus: state.events.status,
      teamStatus: state.teams.status,
      whoAmIStatus: state.whoami.status
    }
  }

  const me = state.whoami.whoami!;
  const events = Object.values (state.events.list)
      .map (e => e.event);
  const myEvents = events.filter (e => e.userIds.includes (me.id));
  const myPoints = myEvents.map (e => e.points).reduce ((a, b) => a + b, 0);
  const teamMap = new Map<string, Team> ();
  Object.values (state.teams.list)
      .map (c => c.team)
      .forEach (team => teamMap.set (team.id, {
        id: team.id,
        name: team.name,
        color: team.color,
        points: 0
      }));
  events.forEach (event => {
    event.userIds.forEach (userId => {
      const user = state.users.list[userId];
      if (user) {
        const team = teamMap.get (user.user.teamId);
        if (team) {
          team.points += event.points;
        }
      }
    });
  });
  const teams = Array.from (teamMap.values ());

  return {
    myPoints,
    myEvents,
    me,
    teams,
    eventStatus: HttpStatus.Success,
    teamStatus: HttpStatus.Success,
    userStatus: HttpStatus.Success,
    whoAmIStatus: HttpStatus.Success
  }
}

const mapDispatchToProps = {
  fetchUsers,
  fetchEvents,
  fetchTeams,
  fetchWhoAmI,
};

export const HomeContainer = connect<
    HomeStateProps,
    HomeDispatchProps,
    {},
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (Home);
