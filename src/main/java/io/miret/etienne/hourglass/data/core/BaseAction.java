package io.miret.etienne.hourglass.data.core;

import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import lombok.Getter;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

@Getter
public class BaseAction {

  private final Instant timestamp;

  private final String comment;

  private final UUID actorId;

  public BaseAction (Clock clock, String comment, AuthenticatedUser actor) {
    this.timestamp = Instant.now (clock);
    this.comment = comment;
    this.actorId = actor.getId ();
  }

}
