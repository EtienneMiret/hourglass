package fr.elimerl.hourglass.controllers;

import com.google.common.collect.Sets;
import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.Event;
import fr.elimerl.hourglass.data.core.ScaleRule;
import fr.elimerl.hourglass.data.mongo.EventAction;
import fr.elimerl.hourglass.data.mongo.EventCreation;
import fr.elimerl.hourglass.data.mongo.EventEdition;
import fr.elimerl.hourglass.data.mongo.ScaleRuleAction;
import fr.elimerl.hourglass.data.rest.Form;
import fr.elimerl.hourglass.repositories.EventActionRepository;
import fr.elimerl.hourglass.repositories.ScaleRuleActionRepository;
import fr.elimerl.hourglass.services.ActionComposer;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;
import static lombok.AccessLevel.PRIVATE;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping ("/event")
@AllArgsConstructor (access = PRIVATE)
public class Events {

  private final Clock clock;

  private final EventActionRepository repository;

  private final ScaleRuleActionRepository scaleRuleActionRepository;

  private final ActionComposer composer;

  @GetMapping
  public Set<Event> find (@RequestParam (required = false) UUID userId) {
    Collection<EventAction> actions;
    if (userId == null) {
      actions = repository.findAll ();
    } else {
      Set<UUID> potentialIds = repository.findByUserIdsContaining (userId)
          .stream ()
          .map (EventAction::getEventId)
          .collect (toSet ());
      actions = repository.findByEventIdIn (potentialIds);
    }
    Set <Event> events = actions.stream ()
        .collect (groupingBy (EventAction::getEventId))
        .values ()
        .stream ()
        .map (composer::compose)
        .collect (toSet ());
    return addPoints (events);
  }

  @PostMapping
  public Event create (@RequestBody Form<Event> form) {
    UUID scaleRuleId = form.getObject ()
        .getScaleRuleId ();
    Set<ScaleRuleAction> ruleActions =
        scaleRuleActionRepository.findByScaleRuleId (scaleRuleId);
    if (ruleActions.isEmpty ()) {
      throw new ResponseStatusException (BAD_REQUEST, "No such rule: " + scaleRuleId);
    }

    BaseAction ba = new BaseAction (clock, form.getComment ());
    EventCreation creation = new EventCreation (ba, form.getObject ());
    repository.save (creation);
    return addPoints (composer.compose (Set.of (creation)));
  }

  @PatchMapping ("/{id}")
  public Event update (@PathVariable UUID id, @RequestBody Form<Event> form) {
    Set<EventAction> actions = repository.findByEventId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }

    UUID scaleRuleId = form.getObject ()
        .getScaleRuleId ();
    if (scaleRuleId != null) {
      Set<ScaleRuleAction> ruleActions =
          scaleRuleActionRepository.findByScaleRuleId (scaleRuleId);
      if (ruleActions.isEmpty ()) {
        throw new ResponseStatusException (BAD_REQUEST, "No such rule: " + scaleRuleId);
      }
    }

    BaseAction ba = new BaseAction (clock, form.getComment ());
    EventEdition edition = new EventEdition (ba, form.getObject ().withId (id));
    repository.save (edition);
    return addPoints (composer.compose (Sets.union (actions, Set.of (edition))));
  }

  @GetMapping ("/{id}")
  public Event get (@PathVariable UUID id) {
    Set<EventAction> actions = repository.findByEventId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }
    return addPoints (composer.compose (actions));
  }

  private Set<Event> addPoints (Collection<Event> events) {
    Set<UUID> scaleRuleIds = events.stream ()
        .map (Event::getScaleRuleId)
        .collect (toSet ());
    Map<UUID, Integer> points = scaleRuleActionRepository.findByScaleRuleIdIn (scaleRuleIds)
        .stream ()
        .collect (groupingBy (
            ScaleRuleAction::getScaleRuleId,
            collectingAndThen (toSet (), actions -> composer.compose (actions).getPoints ())
        ));
    return events.stream ()
        .map (e -> e.withPoints (points.get (e.getScaleRuleId ())))
        .collect (toSet ());
  }

  private Event addPoints (Event event) {
    Set<ScaleRuleAction> actions = scaleRuleActionRepository.findByScaleRuleId (event.getScaleRuleId ());
    ScaleRule rule = composer.compose (actions);
    return event.withPoints (rule.getPoints ());
  }

}
