import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { GlobalState } from '../state';
import {
  RuleList,
  RuleListDispatchProps,
  RuleListStateProps
} from '../components/RuleList';
import { HttpStatus } from '../state/status';
import { fetchRules } from '../actions/rules';
import { editRuleStart } from '../actions/rule-edition';

function mapStateToProps (state: GlobalState): RuleListStateProps {
  const rules = Object.values (state.rules.list)
      .map (r => r.rule);
  rules.sort ((a, b) => a.name.localeCompare (b.name));
  return {
    prefect: state.whoami.status === HttpStatus.Success
        && state.whoami.whoami!.prefect,
    creation: state.rules.creation,
    rules,
    status: state.rules.status
  };
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>
): RuleListDispatchProps {
  return {
    startCreate: () => dispatch (editRuleStart (null)),
    fetch: () => dispatch (fetchRules ())
  }
}

export const RuleListContainer = connect<
    RuleListStateProps,
    RuleListDispatchProps,
    {},
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (RuleList);
