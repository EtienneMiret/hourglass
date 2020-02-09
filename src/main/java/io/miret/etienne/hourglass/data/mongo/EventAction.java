package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Event;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import static lombok.AccessLevel.PROTECTED;

@Getter
@NoArgsConstructor (access = PROTECTED)
public abstract class EventAction extends Action<Event> {

  private UUID eventId;

  private String name;

  private LocalDate date;

  private UUID scaleRuleId;

  private Set<UUID> userIds;

  public EventAction (BaseAction action, Event event) {
    super (action);
    this.eventId = event.getId ();
    this.name = event.getName ();
    this.date = event.getDate ();
    this.scaleRuleId = event.getScaleRuleId ();
    this.userIds = event.getUserIds ();
  }

}
