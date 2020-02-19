package io.miret.etienne.hourglass.controllers;

import com.google.common.collect.Sets;
import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Event;
import io.miret.etienne.hourglass.data.core.ScaleRule;
import io.miret.etienne.hourglass.data.mongo.EventAction;
import io.miret.etienne.hourglass.data.mongo.EventCreation;
import io.miret.etienne.hourglass.data.mongo.EventEdition;
import io.miret.etienne.hourglass.data.mongo.ScaleRuleAction;
import io.miret.etienne.hourglass.data.rest.Form;
import io.miret.etienne.hourglass.repositories.EventActionRepository;
import io.miret.etienne.hourglass.repositories.ScaleRuleActionRepository;
import io.miret.etienne.hourglass.services.ActionComposer;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping ("/events")
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
  public Event create (
      @RequestBody Form<Event> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    validateCreation (form);

    BaseAction ba = new BaseAction (clock, form.getComment (), user);
    EventCreation creation = new EventCreation (ba, form.getObject ());
    repository.save (creation);
    return addPoints (composer.compose (Set.of (creation)));
  }

  @PatchMapping ("/{id}")
  public Event update (
      @PathVariable UUID id,
      @RequestBody Form<Event> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    Set<EventAction> actions = repository.findByEventId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }

    validateUpdate (form);

    BaseAction ba = new BaseAction (clock, form.getComment (), user);
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

  private void validateCreation (Form<Event> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "Nothing to create.");
    }

    var event = form.getObject ();

    if (event.getDate () == null
        || event.getName () == null
        || event.getName ().isBlank ()
        || event.getScaleRuleId () == null
        || event.getUserIds () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "Missing mandatory field.");
    }

    var scaleRuleId = event.getScaleRuleId ();
    var ruleActions = scaleRuleActionRepository.findByScaleRuleId (scaleRuleId);
    if (ruleActions.isEmpty ()) {
      throw new ResponseStatusException (BAD_REQUEST, "No such rule: " + scaleRuleId);
    }
  }

  private void validateUpdate (Form<Event> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "No update to apply.");
    }

    var event = form.getObject ();

    if (event.getScaleRuleId () != null) {
      var scaleRuleId = event.getScaleRuleId ();
      var ruleActions = scaleRuleActionRepository.findByScaleRuleId (scaleRuleId);
      if (ruleActions.isEmpty ()) {
        throw new ResponseStatusException (BAD_REQUEST, "No such rule: " + scaleRuleId);
      }
    }

    if (event.getName () != null) {
      if (event.getName ().isBlank ()) {
        throw new ResponseStatusException (BAD_REQUEST, "Missing name.");
      }
    }
  }

}
