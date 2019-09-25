package fr.elimerl.hourglass.data.mongo;

import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.Event;
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
    return new Event (getEventId (), getName (), getScaleRuleId (), null, getUserIds ());
  }

}
