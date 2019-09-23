package fr.elimerl.hourglass.data.mongo;

import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.ScaleRule;

import java.util.UUID;

public class ScaleRuleCreation extends ScaleRuleAction {

  private ScaleRuleCreation () {
    super ();
  }

  public ScaleRuleCreation (BaseAction action, ScaleRule scaleRule) {
    super (action, scaleRule.withId (UUID.randomUUID ()));
  }

  @Override
  public ScaleRule apply (ScaleRule scaleRule) {
    return new ScaleRule (getScaleRuleId (), getName (), getPoints ());
  }

}
