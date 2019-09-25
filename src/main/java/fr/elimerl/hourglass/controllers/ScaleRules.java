package fr.elimerl.hourglass.controllers;

import com.google.common.collect.Sets;
import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.ScaleRule;
import fr.elimerl.hourglass.data.mongo.ScaleRuleAction;
import fr.elimerl.hourglass.data.mongo.ScaleRuleCreation;
import fr.elimerl.hourglass.data.mongo.ScaleRuleEdition;
import fr.elimerl.hourglass.data.rest.Form;
import fr.elimerl.hourglass.repositories.ScaleRuleActionRepository;
import fr.elimerl.hourglass.services.ActionComposer;
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

import static java.util.stream.Collectors.toSet;
import static lombok.AccessLevel.PRIVATE;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@AllArgsConstructor (access = PRIVATE)
@RequestMapping ("/scale")
public class ScaleRules {

  private final Clock clock;

  private final ScaleRuleActionRepository repository;

  private final ActionComposer composer;

  @GetMapping
  public Set<UUID> list () {
    return repository.findAll ()
        .stream ()
        .map (ScaleRuleAction::getScaleRuleId)
        .collect (toSet ());
  }

  @PostMapping
  public ScaleRule create (@RequestBody Form<ScaleRule> form) {
    BaseAction ba = new BaseAction (clock, form.getComment ());
    ScaleRuleCreation creation = new ScaleRuleCreation (ba, form.getObject ());
    repository.save (creation);
    return composer.compose (Set.of (creation));
  }

  @PatchMapping ("/{id}")
  public ScaleRule update (@PathVariable UUID id, @RequestBody Form<ScaleRule> form) {
    Set<ScaleRuleAction> actions = repository.findByScaleRuleId (id);
    if (actions.isEmpty ()) {
      throw new ResponseStatusException (NOT_FOUND);
    }

    BaseAction ba = new BaseAction (clock, form.getComment ());
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

}
