package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Event;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor (access = PRIVATE)
public class EventCreation extends EventAction {

  public EventCreation (BaseAction action, Event event) {
    super (action, event.withId (UUID.randomUUID ()));
  }

  @Override
  public Event apply (Event event) {
    return new Event (getEventId (), getName (), getDate (), getScaleRuleId (), null, getUserIds ());
  }

}
