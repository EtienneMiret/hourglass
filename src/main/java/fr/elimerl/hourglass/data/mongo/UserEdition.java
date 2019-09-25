package fr.elimerl.hourglass.data.mongo;

import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.User;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor (access = PRIVATE)
public class UserEdition extends UserAction {

  public UserEdition (BaseAction action, User user) {
    super (action, user);
  }

  @Override
  public User apply (User user) {
    User result = user;
    if (getName () != null) {
      result = result.withName (getName ());
    }
    if (getEmails () != null) {
      result = result.withEmails (getEmails ());
    }
    return result;
  }

}
