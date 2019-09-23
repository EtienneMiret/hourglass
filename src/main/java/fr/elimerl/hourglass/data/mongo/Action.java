package fr.elimerl.hourglass.data.mongo;

import fr.elimerl.hourglass.data.core.BaseAction;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

import static lombok.AccessLevel.PROTECTED;

@Getter
@NoArgsConstructor (access = PROTECTED)
public abstract class Action<T> implements Comparable<Action> {

  private String id;

  private Instant timestamp;

  private String comment;

  public Action (BaseAction action) {
    this.timestamp = action.getTimestamp ();
    this.comment = action.getComment ();
  }

  public abstract T apply (T t);

  @Override
  public int compareTo (Action o) {
    return timestamp.compareTo (o.timestamp);
  }

}
