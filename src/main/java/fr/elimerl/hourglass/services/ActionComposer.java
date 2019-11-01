package fr.elimerl.hourglass.services;

import fr.elimerl.hourglass.data.mongo.Action;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Comparator;
import java.util.function.Function;

import static java.util.function.Function.identity;

@Service
public class ActionComposer {

  public <T> T compose (Collection<? extends Action<T>> actions) {
    return actions.stream ()
        .sorted (Comparator.<Action<T>>naturalOrder ().reversed ())
        .<Function<T, T>>map (identity ())
        .reduce (identity (), Function::compose)
        .apply (null);
  }

}
