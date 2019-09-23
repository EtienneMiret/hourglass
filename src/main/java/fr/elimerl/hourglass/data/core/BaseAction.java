package fr.elimerl.hourglass.data.core;

import java.time.Clock;
import java.time.Instant;

public class BaseAction {

  private final Instant timestamp;

  private final String comment;

  public BaseAction (Clock clock, String comment) {
    this.timestamp = Instant.now (clock);
    this.comment = comment;
  }

  public Instant getTimestamp () {
    return timestamp;
  }

  public String getComment () {
    return comment;
  }

}
