package io.miret.etienne.hourglass.controllers;

import com.google.common.collect.Sets;
import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.ScaleRule;
import io.miret.etienne.hourglass.data.mongo.ScaleRuleAction;
import io.miret.etienne.hourglass.data.mongo.ScaleRuleCreation;
import io.miret.etienne.hourglass.data.mongo.ScaleRuleEdition;
import io.miret.etienne.hourglass.data.rest.Form;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.util.Set;
import java.util.UUID;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;
import static lombok.AccessLevel.PRIVATE;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@AllArgsConstructor (access = PRIVATE)
@RequestMapping ("/rules")
public class ScaleRules {

  private final Clock clock;

  private final ScaleRuleActionRepository repository;

  private final ActionComposer composer;

  @GetMapping
  public Set<ScaleRule> list () {
    return repository.findAll ()
        .stream ()
        .collect (groupingBy (ScaleRuleAction::getScaleRuleId))
        .values ()
        .stream ()
        .map (composer::compose)
        .collect (toSet ());
  }

  @PostMapping
  public ScaleRule create (
      @RequestBody Form<ScaleRule> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    validateCreation (form);

    BaseAction ba = new BaseAction (clock, form.getComment (), user);
    ScaleRuleCreation creation = new ScaleRuleCreation (ba, form.getObject ());
    repository.save (creation);
    return composer.compose (Set.of (creation));
  }

  @PatchMapping ("/{id}")
  public ScaleRule update (
      @PathVariable UUID id,
      @RequestBody Form<ScaleRule> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    Set<ScaleRuleAction> actions = repository.findByScaleRuleId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }

    validateUpdate (form);

    BaseAction ba = new BaseAction (clock, form.getComment (), user);
    ScaleRuleEdition edition = new ScaleRuleEdition (ba, form.getObject ().withId (id));
    repository.save (edition);
    return composer.compose (Sets.union (actions, Set.of (edition)));
  }

  @GetMapping ("/{id}")
  public ScaleRule get (@PathVariable UUID id) {
    Set<ScaleRuleAction> actions = repository.findByScaleRuleId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }
    return composer.compose (actions);
  }

  private void validateCreation (Form<ScaleRule> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "Nothing to create.");
    }

    var scaleRule = form.getObject ();
    if (scaleRule.getName () == null
        || scaleRule.getName ().isBlank ()
        || scaleRule.getPoints () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "Missing mandatory field.");
    }
  }

  private void validateUpdate (Form<ScaleRule> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "No update to apply.");
    }

    var scaleRule = form.getObject ();

    if (scaleRule.getName () != null) {
      if (scaleRule.getName ().isBlank ()) {
        throw new ResponseStatusException (BAD_REQUEST, "Missing name.");
      }
    }
  }

}
