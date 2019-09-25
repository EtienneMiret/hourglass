package fr.elimerl.hourglass.services;

import fr.elimerl.hourglass.data.mongo.Action;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Set;
import java.util.function.Function;

import static java.util.function.Function.identity;

@Service
public class ActionComposer {

  public <T> T compose (Set<? extends Action<T>> actions) {
    return actions.stream ()
        .sorted (Comparator.<Action<T>>naturalOrder ().reversed ())
        .<Function<T, T>>map (scaleRuleAction -> scaleRuleAction::apply)
        .reduce (identity (), Function::compose)
        .apply (null);
  }

}
