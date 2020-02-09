package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Team;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor (access = PRIVATE)
public class TeamEdition extends TeamAction {

  public TeamEdition (BaseAction action, Team team) {
    super (action, team);
  }

  @Override
  public Team apply (Team team) {
    Team result = team;
    if (getName () != null) {
      result = result.withName (getName ());
    }
    if (getColor () != null) {
      result = result.withColor (getColor ());
    }
    return result;
  }

}
