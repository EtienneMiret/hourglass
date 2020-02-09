package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.User;
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
    if (getTeamId () != null) {
      result = result.withTeamId (getTeamId ());
    }
    if (getName () != null) {
      result = result.withName (getName ());
    }
    if (getEmails () != null) {
      result = result.withEmails (getEmails ());
    }
    return result;
  }

}
