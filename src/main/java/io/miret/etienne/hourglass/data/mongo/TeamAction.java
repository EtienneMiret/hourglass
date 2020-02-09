package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Team;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static lombok.AccessLevel.PROTECTED;

@Getter
@NoArgsConstructor (access = PROTECTED)
public abstract class TeamAction extends Action<Team> {

  private UUID teamId;

  private String name;

  private String color;

  public TeamAction (BaseAction action, Team team) {
    super (action);
    this.teamId = team.getId ();
    this.name = team.getName ();
    this.color = team.getColor ();
  }

}
