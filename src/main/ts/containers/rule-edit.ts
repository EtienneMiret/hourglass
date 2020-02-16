import { ThunkDispatch } from 'redux-thunk';
import { NewRule, Rule } from '../state/rule';
import { GlobalState } from '../state';
import {
  RuleEdit,
  RuleEditDispatchProps,
  RuleEditStateProps
} from '../components/RuleEdit';
import { Action } from '../actions';
import { connect } from 'react-redux';
import {
  createRule,
  editRule, editRuleCancel,
  editRuleSetName,
  editRuleSetPoints
} from '../actions/rule-edition';

export interface RuleEditOwnProps {
  rule: Rule | NewRule;
}

function mapStateToProps (
    state: GlobalState,
    {rule}: RuleEditOwnProps
): RuleEditStateProps {
  return {rule};
}

function mapDispatchToProps (
    dispatch: ThunkDispatch<GlobalState, undefined, Action>,
    {rule}: RuleEditOwnProps
): RuleEditDispatchProps {
  const id = (rule as Rule).id || null;

  return {
    setName: name => dispatch (editRuleSetName (id, name)),
    setPoints: points => dispatch (editRuleSetPoints (id, points)),
    submitEdits: comment => {
      if (id) {
        return dispatch (editRule (rule as Rule, comment));
      } else {
        return dispatch (createRule (rule as NewRule, comment));
      }
    },
    cancelEdits: () => dispatch (editRuleCancel (id))
  }
}

export const RuleEditContainer = connect<
    RuleEditStateProps,
    RuleEditDispatchProps,
    RuleEditOwnProps,
    GlobalState
> (
    mapStateToProps,
    mapDispatchToProps
) (RuleEdit);
