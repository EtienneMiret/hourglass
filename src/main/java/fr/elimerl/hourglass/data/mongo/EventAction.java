package fr.elimerl.hourglass.data.mongo;

import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.Event;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

import static lombok.AccessLevel.PROTECTED;

@Getter
@NoArgsConstructor (access = PROTECTED)
public abstract class EventAction extends Action<Event> {

  private UUID eventId;

  private String name;

  private UUID scaleRuleId;

  private Set<UUID> userIds;

  public EventAction (BaseAction action, Event event) {
    super (action);
    this.eventId = event.getId ();
    this.name = event.getName ();
    this.scaleRuleId = event.getScaleRuleId ();
    this.userIds = event.getUserIds ();
  }

}
