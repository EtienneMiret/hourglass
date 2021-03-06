package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;
import java.util.function.Function;

import static lombok.AccessLevel.PROTECTED;

@Getter
@Document
@NoArgsConstructor (access = PROTECTED)
public abstract class Action<T> implements Comparable<Action>, Function<T, T> {

  @Id
  private String id;

  private Instant timestamp;

  private String comment;

  private UUID actorId;

  public Action (BaseAction action) {
    this.timestamp = action.getTimestamp ();
    this.comment = action.getComment ();
    this.actorId = action.getActorId ();
  }

  public abstract T apply (T t);

  @Override
  public int compareTo (Action o) {
    return timestamp.compareTo (o.timestamp);
  }

}
