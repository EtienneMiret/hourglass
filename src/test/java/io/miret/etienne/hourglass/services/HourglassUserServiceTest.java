package io.miret.etienne.hourglass.services;

import io.miret.etienne.hourglass.data.config.AppConfiguration;
import io.miret.etienne.hourglass.data.config.SecurityConfiguration;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.User;
import io.miret.etienne.hourglass.data.mongo.UserAction;
import io.miret.etienne.hourglass.data.mongo.UserCreation;
import io.miret.etienne.hourglass.repositories.UserActionRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static io.miret.etienne.hourglass.data.auth.AuthenticatedUser.PREFECT;
import static io.miret.etienne.hourglass.data.auth.AuthenticatedUser.STUDENT;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith (MockitoExtension.class)
class HourglassUserServiceTest {

  private static final UUID REGULAR_USER_ID =
      UUID.fromString ("F499FC9B-236B-47B2-BC28-3AF6D1C62A8C");

  private static final UUID ADMIN_USER_ID =
      UUID.fromString ("B859853A-292E-498E-8018-142DBECC30FA");

  private static final String REGULAR_USER_NAME = "User";

  private static final String ADMIN_USER_NAME = "Admin";

  private HourglassUserService userService;

  @Mock
  private OidcUserService oidcUserService;

  @Mock
  private UserActionRepository userActionRepository;

  @Mock
  private ActionComposer composer;

  @Mock
  private AppConfiguration appConfiguration;

  @Mock
  private SecurityConfiguration securityConfiguration;

  @Mock
  private OidcUserRequest request;

  @Mock
  private OidcUser oidcUser;

  @BeforeEach
  void setup () {
    var clock = Clock.fixed (Instant.EPOCH, ZoneOffset.UTC);
    var regularUser = new User (
        REGULAR_USER_ID,
        REGULAR_USER_NAME,
        Set.of ("user@miret.io", "foo@miret.io", "bar@miret.io")
    );
    var adminUser = new User (
        ADMIN_USER_ID,
        ADMIN_USER_NAME,
        Set.of ("admin@miret.io")
    );
    var fooUser = new User (
        UUID.fromString ("EC185693-AB4A-4846-B7D2-393361A545A0"),
        "ZZZZ",
        Set.of ("foo@miret.io")
    );
    var regularUserAction = new UserCreation (
        new BaseAction (clock, ""),
        regularUser
    );
    var adminUserAction = new UserCreation (
        new BaseAction (clock, ""),
        adminUser
    );
    var fooUserAction = new UserCreation (
        new BaseAction (clock, ""),
        fooUser
    );

    when (appConfiguration.getSecurity ()).thenReturn (securityConfiguration);
    when (securityConfiguration.getPrefects ()).thenReturn (Set.of (
        "admin@miret.io",
        "root@miret.io"
    ));
    when (oidcUserService.loadUser (request)).thenReturn (oidcUser);
    when (userActionRepository.findAll ()).thenReturn (List.of (
        regularUserAction,
        adminUserAction,
        fooUserAction
    ));
    when (composer.compose (any ())).then (i -> {
      Collection<UserAction> actions = i.getArgument (0);
      if (actions.contains (regularUserAction)) {
        return regularUser;
      } else if (actions.contains (adminUserAction)) {
        return adminUser;
      } else if (actions.contains (fooUserAction)) {
        return fooUser;
      } else {
        return fail ("Unknown user: %s.", actions);
      }
    });

    userService = new HourglassUserService (
        oidcUserService,
        userActionRepository,
        composer,
        appConfiguration
    );
  }

  @Test
  void should_load_regular_user () {
    when (oidcUser.getAuthorities ()).then (i -> Set.of (
        oidcUserAuthority ("user@miret.io")
    ));

    var actual = userService.loadUser (request);

    Assertions.<GrantedAuthority>assertThat (actual.getAuthorities ())
        .containsOnly (STUDENT);
    assertThat (actual.getId ()).isEqualTo (REGULAR_USER_ID);
    assertThat (actual.getName ()).isEqualTo (REGULAR_USER_NAME);
  }

  @Test
  void should_load_admin_user () {
    when (oidcUser.getAuthorities ()).then (i -> Set.of (
        oidcUserAuthority ("admin@miret.io")
    ));

    var actual = userService.loadUser (request);

    Assertions.<GrantedAuthority>assertThat (actual.getAuthorities ())
        .containsOnly (STUDENT, PREFECT);
    assertThat (actual.getId ()).isEqualTo (ADMIN_USER_ID);
    assertThat (actual.getName ()).isEqualTo (ADMIN_USER_NAME);
  }

  @Test
  void should_load_anonymous_user () {
    when (oidcUser.getAuthorities ()).then (i -> Set.of (
        oidcUserAuthority ("unknown@example.org")
    ));

    var actual = userService.loadUser (request);

    assertThat (actual.getAuthorities ()).isEmpty ();
  }

  @Test
  void should_load_first_foo_user () {
    when (oidcUser.getAuthorities ()).then (i -> Set.of (
        oidcUserAuthority ("foo@miret.io")
    ));

    var actual = userService.loadUser (request);

    assertThat (actual.getId ()).isEqualTo (REGULAR_USER_ID);
  }

  private GrantedAuthority oidcUserAuthority (String email) {
    var claims = Collections.<String, Object>singletonMap ("email", email);
    OidcIdToken token =
        new OidcIdToken ("foo", Instant.EPOCH, Instant.MAX, claims);
    return new OidcUserAuthority (token, null);
  }

}
