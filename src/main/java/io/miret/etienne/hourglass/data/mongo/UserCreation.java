package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.User;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor (access = PRIVATE)
public class UserCreation extends UserAction {

  public UserCreation (BaseAction action, User user) {
    super (action, user.withId (UUID.randomUUID ()));
  }

  @Override
  public User apply (User user) {
    return new User (getUserId (), getTeamId (), getName (), getEmails ());
  }

}
