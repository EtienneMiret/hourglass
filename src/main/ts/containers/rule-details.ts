import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { GlobalState } from '../state';
import {
  RuleDetails,
  RuleDetailsDispatchProps,
  RuleDetailsStateProps
} from '../components/RuleDetails';
import { HttpStatus } from '../state/status';
import { Action } from '../actions';
import { fetchRule } from '../actions/rule';
import { editRuleStart } from '../actions/rule-edition';

export interface RuleDetailsOwnProps {
  match: {
    params: {
      ruleId: string;
    }
  }
}

function mapStateToProps (
    state: GlobalState,
    {match: {params: {ruleId}}}: RuleDetailsOwnProps
): RuleDetailsStateProps {
  const prefect =
      state.whoami.status === HttpStatus.Success && state.whoami.whoami!.prefect;
  const container = state.rules.list[ruleId];
  if (container) {
    return {
      prefect,
      edition: container.edition || undefined,
      rule: container.rule,
      status: container.status
    };

  }

  if (state.rules.status === HttpStatus.Success) {
    return {
      prefect,
      status: HttpStatus.None
    };
  }

  return {
    prefect,
    status: state.rules.status
  }
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {match: {params: {ruleId}}}: RuleDetailsOwnProps
): RuleDetailsDispatchProps {
  return {
    fetch: () => dispatch (fetchRule (ruleId)),
    edit: () => dispatch (editRuleStart (ruleId))
  };
}

export const RuleDetailsContainer = connect<
    RuleDetailsStateProps,
    RuleDetailsDispatchProps,
    RuleDetailsOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (RuleDetails);
