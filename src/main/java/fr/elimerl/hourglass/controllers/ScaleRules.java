package fr.elimerl.hourglass.controllers;

import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.ScaleRule;
import fr.elimerl.hourglass.data.mongo.ScaleRuleAction;
import fr.elimerl.hourglass.data.mongo.ScaleRuleCreation;
import fr.elimerl.hourglass.data.mongo.ScaleRuleEdition;
import fr.elimerl.hourglass.data.rest.Form;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Clock;
import java.util.Comparator;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.function.Function;

import static java.util.function.Function.identity;

@RestController
@RequestMapping ("/scale")
public class ScaleRules {

  private final Map<UUID, Set<ScaleRuleAction>> store = new ConcurrentHashMap<> ();

  private final Clock clock;

  @Autowired
  private ScaleRules (Clock clock) {
    this.clock = clock;
  }

  @GetMapping
  public Set<UUID> list () {
    return store.keySet ();
  }

  @PostMapping
  public ScaleRule create (@RequestBody Form<ScaleRule> form) {
    BaseAction ba = new BaseAction (clock, form.getComment ());
    ScaleRuleCreation creation = new ScaleRuleCreation (ba, form.getObject ());
    ConcurrentSkipListSet<ScaleRuleAction> actions = new ConcurrentSkipListSet<> ();
    actions.add (creation);
    store.put (creation.getScaleRuleId (), actions);
    return get (actions);
  }

  @PatchMapping ("/{id}")
  public ScaleRule update (@PathVariable UUID id, @RequestBody Form<ScaleRule> form) {
    BaseAction ba = new BaseAction (clock, form.getComment ());
    ScaleRuleEdition edition = new ScaleRuleEdition (ba, form.getObject ().withId (id));
    Set<ScaleRuleAction> actions = store.get (id);
    actions.add (edition);
    return get (actions);
  }

  @GetMapping ("/{id}")
  public ScaleRule get (@PathVariable UUID id) {
    return get (store.get (id));
  }

  private ScaleRule get (Set<ScaleRuleAction> actions) {
    return actions.stream ()
        .sorted (Comparator.<ScaleRuleAction>naturalOrder ().reversed ())
        .<Function<ScaleRule, ScaleRule>>map (scaleRuleAction -> scaleRuleAction::apply)
        .reduce (identity (), Function::compose)
        .apply (null);
  }

}
