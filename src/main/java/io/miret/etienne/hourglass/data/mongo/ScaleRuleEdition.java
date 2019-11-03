package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.ScaleRule;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor (access = PRIVATE)
public class ScaleRuleEdition extends ScaleRuleAction {

  public ScaleRuleEdition (BaseAction action, ScaleRule scaleRule) {
    super (action, scaleRule);
  }

  @Override
  public ScaleRule apply (ScaleRule base) {
    ScaleRule result = base;
    if (getName () != null) {
      result = result.withName (getName ());
    }
    if (getPoints () != null) {
      result = result.withPoints (getPoints ());
    }
    return result;
  }

}
