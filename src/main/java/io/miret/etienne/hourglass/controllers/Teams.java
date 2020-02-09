package io.miret.etienne.hourglass.controllers;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Team;
import io.miret.etienne.hourglass.data.mongo.TeamAction;
import io.miret.etienne.hourglass.data.mongo.TeamCreation;
import io.miret.etienne.hourglass.data.mongo.TeamEdition;
import io.miret.etienne.hourglass.data.rest.Form;
import io.miret.etienne.hourglass.repositories.TeamActionRepository;
import io.miret.etienne.hourglass.services.ActionComposer;
import lombok.AllArgsConstructor;
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

import static com.google.common.collect.Sets.union;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;
import static lombok.AccessLevel.PRIVATE;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping ("/teams")
@AllArgsConstructor (access = PRIVATE)
public class Teams {

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
  public Team create (@RequestBody Form<Team> form) {
    var ba = new BaseAction (clock, form.getComment ());
    var creation = new TeamCreation (ba, form.getObject ());
    repository.save (creation);
    return creation.apply (null);
  }

  @PatchMapping ("/{id}")
  public Team update (@PathVariable UUID id, @RequestBody Form<Team> form) {
    var actions = repository.findByTeamId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }

    var ba = new BaseAction (clock, form.getComment ());
    var edition = new TeamEdition (ba, form.getObject ().withId (id));
    repository.save (edition);
    return composer.compose (union (actions, Set.of (edition)));
  }

}
