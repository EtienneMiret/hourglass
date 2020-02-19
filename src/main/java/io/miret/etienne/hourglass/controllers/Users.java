package io.miret.etienne.hourglass.controllers;

import com.google.common.collect.Sets;
import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.User;
import io.miret.etienne.hourglass.data.mongo.UserAction;
import io.miret.etienne.hourglass.data.mongo.UserCreation;
import io.miret.etienne.hourglass.data.mongo.UserEdition;
import io.miret.etienne.hourglass.data.rest.Form;
import io.miret.etienne.hourglass.repositories.TeamActionRepository;
import io.miret.etienne.hourglass.repositories.UserActionRepository;
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
import java.util.Set;
import java.util.UUID;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;
import static lombok.AccessLevel.PRIVATE;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping ("/users")
@AllArgsConstructor (access = PRIVATE)
public class Users {

  private final Clock clock;

  private final UserActionRepository repository;

  private final TeamActionRepository teamActionRepository;

  private final ActionComposer composer;

  @GetMapping
  public Set<User> find (@RequestParam (required = false) String email) {
    if (email == null) {
      return repository.findAll ()
          .stream ()
          .collect (groupingBy (UserAction::getUserId))
          .values ()
          .stream ()
          .map (composer::compose)
          .collect (toSet ());
    } else {
      Set<UUID> potentialIds = repository.findByEmailsContaining (email)
          .stream ()
          .map (UserAction::getUserId)
          .collect (toSet ());
      return repository.findByUserIdIn (potentialIds)
          .stream ()
          .collect (groupingBy (UserAction::getUserId))
          .values ()
          .stream ()
          .map (composer::compose)
          .filter (u -> u.getEmails ().contains (email))
          .collect (toSet ());
    }
  }

  @PostMapping
  public User create (
      @RequestBody Form<User> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    validateCreation (form);

    BaseAction ba = new BaseAction (clock, form.getComment (), user);
    UserCreation creation = new UserCreation (ba, form.getObject ());
    repository.save (creation);
    return composer.compose (Set.of (creation));
  }

  @PatchMapping ("/{id}")
  public User update (
      @PathVariable UUID id,
      @RequestBody Form<User> form,
      @AuthenticationPrincipal AuthenticatedUser user
  ) {
    Set<UserAction> actions = repository.findByUserId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }

    validateUpdate (form);

    BaseAction ba = new BaseAction (clock, form.getComment (), user);
    UserEdition edition = new UserEdition (ba, form.getObject ().withId (id));
    repository.save (edition);
    return composer.compose (Sets.union (actions, Set.of (edition)));
  }

  @GetMapping ("/{id}")
  public User get (@PathVariable UUID id) {
    Set<UserAction> actions = repository.findByUserId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }
    return composer.compose (actions);
  }

  private void validateCreation (Form<User> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "Nothing to create.");
    }

    var user = form.getObject ();

    if (user.getName () == null
        || user.getName ().isBlank ()
        || user.getEmails () == null
        || user.getTeamId () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "Missing mandatory field.");
    }

    var teamId = user.getTeamId ();
    var teamActions = teamActionRepository.findByTeamId (teamId);
    if (teamActions.isEmpty ()) {
      throw new ResponseStatusException (BAD_REQUEST, "No such team: " + teamId);
    }
  }

  private void validateUpdate (Form<User> form) {
    if (form == null || form.getObject () == null) {
      throw new ResponseStatusException (BAD_REQUEST, "No update to apply.");
    }

    var user = form.getObject ();

    if (user.getTeamId () != null) {
      var teamId = user.getTeamId ();
      var teamActions = teamActionRepository.findByTeamId (teamId);
      if (teamActions.isEmpty ()) {
        throw new ResponseStatusException (BAD_REQUEST, "No such team: " + teamId);
      }
    }

    if (user.getName () != null && user.getName ().isBlank ()) {
      throw new ResponseStatusException (BAD_REQUEST, "Missing name.");
    }
  }

}
