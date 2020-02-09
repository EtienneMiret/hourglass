package io.miret.etienne.hourglass.controllers;

import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.rest.User;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static io.miret.etienne.hourglass.data.auth.AuthenticatedUser.PREFECT;
import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping ("/who-am-i")
@AllArgsConstructor (access = PRIVATE)
public class WhoAmI {

  private static final Logger logger = LoggerFactory.getLogger (WhoAmI.class);

  @GetMapping
  public User get (@AuthenticationPrincipal AuthenticatedUser user) {
    boolean prefect = user.getAuthorities ().contains (PREFECT);
    return new User (user.getId (), user.getName (), prefect);
  }

}
