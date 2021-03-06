package io.miret.etienne.hourglass.controllers;

import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Team;
import io.miret.etienne.hourglass.data.mongo.TeamAction;
import io.miret.etienne.hourglass.data.mongo.TeamCreation;
import io.miret.etienne.hourglass.data.mongo.TeamEdition;
import io.miret.etienne.hourglass.data.rest.Form;
import io.miret.etienne.hourglass.repositories.TeamActionRepository;
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
import java.util.regex.Pattern;

import static com.google.common.collect.Sets.union;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;
import static lombok.AccessLevel.PRIVATE;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping ("/teams")
@AllArgsConstructor (access = PRIVATE)
public class Teams {

  private static final Pattern COLOR_PATTERN =
      Pattern.compile ("#[0-9a-f]{6}", Pattern.CASE_INSENSITIVE);

  private final Clock clock;

  private final TeamActionRepository repository;

  private final ActionComposer composer;

  @GetMapping
  public Set<Team> list () {
    return repository.findAll ()
        .stream ()
        .collect (groupingBy (TeamAction::getTeamId))
        .values ()
        .stream ()
        .map (composer::compose)
        .collect (toSet ());
  }

  @PostMapping
  public Team create (
      @RequestBody Form<Team> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    validateCreation (form);

    var ba = new BaseAction (clock, form.getComment (), user);
    var creation = new TeamCreation (ba, form.getObject ());
    repository.save (creation);
    return creation.apply (null);
  }

  @PatchMapping ("/{id}")
  public Team update (
      @PathVariable UUID id,
      @RequestBody Form<Team> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    var actions = repository.findByTeamId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }

    validateUpdate (form);

    var ba = new BaseAction (clock, form.getComment (), user);
    var edition = new TeamEdition (ba, form.getObject ().withId (id));
    repository.save (edition);
    return composer.compose (union (actions, Set.of (edition)));
  }

  @GetMapping ("/{id}")
  public Team get (@PathVariable UUID id) {
    var actions = repository.findByTeamId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }
    return composer.compose (actions);
  }

  private void validateCreation (Form<Team> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "Nothing to create.");
    }

    var team = form.getObject ();

    if (team.getColor () == null
        || team.getName () == null
        || team.getName ().isBlank ()) {
      throw new ResponseStatusException (BAD_REQUEST, "Missing mandatory field.");
    }

    if (!COLOR_PATTERN.matcher (team.getColor ()).matches ()) {
      throw new ResponseStatusException (BAD_REQUEST, "Invalid color.");
    }
  }

  private void validateUpdate (Form<Team> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "No update to apply.");
    }

    var team = form.getObject ();

    if (team.getColor () != null && !COLOR_PATTERN.matcher (team.getColor ()).matches ()) {
      throw new ResponseStatusException (BAD_REQUEST, "Invalid color.");
    }

    if (team.getName () != null && team.getName ().isBlank ()) {
      throw new ResponseStatusException (BAD_REQUEST, "Missing name.");
    }
  }

}
