package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Team;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor (access = PRIVATE)
public class TeamCreation extends TeamAction {

  public TeamCreation (BaseAction action, Team team) {
    super (action, team.withId (UUID.randomUUID ()));
  }

  @Override
  public Team apply (Team team) {
    return new Team (getTeamId (), getName (), getColor ());
  }

}
