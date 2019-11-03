package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Event;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor (access = PRIVATE)
public class EventEdition extends EventAction {

  public EventEdition (BaseAction action, Event event) {
    super (action, event);
  }

  @Override
  public Event apply (Event event) {
    Event result = event;
    if (getName () != null) {
      result = result.withName (getName ());
    }
    if (getScaleRuleId () != null) {
      result = result.withScaleRuleId (getScaleRuleId ());
    }
    if (getUserIds () != null) {
      result = result.withUserIds (getUserIds ());
    }
    return result;
  }

}
