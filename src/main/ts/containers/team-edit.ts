import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NewTeam, Team } from '../state/team';
import { GlobalState } from '../state';
import {
  TeamEdit,
  TeamEditDispatchProps,
  TeamEditStateProps
} from '../components/TeamEdit';
import {
  createTeam,
  editTeam, editTeamCancel,
  editTeamSetColor,
  editTeamSetName
} from '../actions/team-edition';
import { connect } from 'react-redux';

export interface TeamEditOwnProps {
  team: Team | NewTeam;
}

function mapStateToProps (
    state: GlobalState,
    {team}: TeamEditOwnProps
): TeamEditStateProps {
  return {team};
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {team}: TeamEditOwnProps
): TeamEditDispatchProps {
  const id = (team as Team).id || null;

  return {
    setName: name => dispatch (editTeamSetName (id, name)),
    setColor: color => dispatch (editTeamSetColor (id, color)),
    submitEdits: comment => {
      if (id) {
        return dispatch (editTeam (team as Team, comment));
      } else {
        return dispatch (createTeam (team as NewTeam, comment));
      }
    },
    cancelEdits: () => dispatch (editTeamCancel (id))
  }
}

export const TeamEditContainer = connect<
    TeamEditStateProps,
    TeamEditDispatchProps,
    TeamEditOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (TeamEdit);
