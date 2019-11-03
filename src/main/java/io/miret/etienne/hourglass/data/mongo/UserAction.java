package io.miret.etienne.hourglass.data.mongo;

import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

import static lombok.AccessLevel.PROTECTED;

@Getter
@NoArgsConstructor (access = PROTECTED)
public abstract class UserAction extends Action<User> {

  private UUID userId;

  private String name;

  private Set<String> emails;

  public UserAction (BaseAction action, User user) {
    super (action);
    this.userId = user.getId ();
    this.name = user.getName ();
    this.emails = user.getEmails ();
  }

}
