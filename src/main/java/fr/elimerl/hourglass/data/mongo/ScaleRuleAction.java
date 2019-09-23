package fr.elimerl.hourglass.data.mongo;

import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.ScaleRule;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static lombok.AccessLevel.PROTECTED;

@Getter
@NoArgsConstructor (access = PROTECTED)
public abstract class ScaleRuleAction extends Action<ScaleRule> {

  private UUID scaleRuleId;

  private String name;

  private Integer points;

  public ScaleRuleAction (BaseAction action, ScaleRule scaleRule) {
    super (action);
    this.scaleRuleId = scaleRule.getId ();
    this.name = scaleRule.getName ();
    this.points = scaleRule.getPoints ();
  }

}
