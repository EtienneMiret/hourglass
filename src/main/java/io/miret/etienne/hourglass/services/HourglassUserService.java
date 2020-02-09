package io.miret.etienne.hourglass.services;

import com.google.common.collect.Sets;
import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.config.AppConfiguration;
import io.miret.etienne.hourglass.data.config.SecurityConfiguration;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.User;
import io.miret.etienne.hourglass.data.mongo.UserAction;
import io.miret.etienne.hourglass.data.mongo.UserCreation;
import io.miret.etienne.hourglass.repositories.UserActionRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static io.miret.etienne.hourglass.data.auth.AuthenticatedUser.PREFECT;
import static io.miret.etienne.hourglass.data.auth.AuthenticatedUser.STUDENT;
import static io.miret.etienne.hourglass.data.auth.AuthenticatedUser.UNKNOWN_PREFECT;
import static java.util.Collections.emptySet;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;

@Service
public class HourglassUserService
    implements OAuth2UserService<OidcUserRequest, OidcUser> {

  private final Clock clock;

  private final OidcUserService delegate;

  private final UserActionRepository userActionRepository;

  private final ActionComposer composer;

  private final Set<String> prefects;

  public HourglassUserService (
      Clock clock,
      OidcUserService oidcUserService,
      UserActionRepository userActionRepository,
      ActionComposer composer,
      AppConfiguration configuration
  ) {
    this.clock = clock;
    this.delegate = oidcUserService;
    this.userActionRepository = userActionRepository;
    this.composer = composer;
    this.prefects = Optional.ofNullable (configuration.getSecurity ())
        .map (SecurityConfiguration::getPrefects)
        .orElse (emptySet ());
  }

  @Override
  public AuthenticatedUser loadUser (OidcUserRequest userRequest)
      throws OAuth2AuthenticationException {
    OidcUser oidcUser = delegate.loadUser (userRequest);

    Set<String> emails = oidcUser.getAuthorities ()
        .stream ()
        .filter (OidcUserAuthority.class::isInstance)
        .map (OidcUserAuthority.class::cast)
        .map (OidcUserAuthority::getAttributes)
        .filter (Objects::nonNull)
        .map (attributes -> attributes.get ("email"))
        .filter (String.class::isInstance)
        .map (String.class::cast)
        .collect (toSet ());

    boolean prefect = !Sets.intersection (prefects, emails).isEmpty ();

    Optional<User> user = userActionRepository.findAll ()
        .stream ()
        .collect (groupingBy (UserAction::getUserId))
        .values ()
        .stream ()
        .map (composer::compose)
        .filter (u -> !Sets.intersection (u.getEmails (), emails).isEmpty ())
        .min (comparing (User::getName))
        .or (() -> createIfPrefect (prefect, emails));

    Set<GrantedAuthority> authorities;
    if (prefect) {
      authorities = Set.of (STUDENT, PREFECT);
    } else if (user.isPresent ()) {
      authorities = Set.of (STUDENT);
    } else {
      authorities = emptySet ();
    }

    UUID id = user.map (User::getId).orElseGet (UUID::randomUUID);
    UUID teamId = user.map (User::getTeamId).orElse (null);
    String name = user.map (User::getName).orElse ("Anonymous");

    return new AuthenticatedUser (id, teamId, name, authorities, oidcUser);
  }

  private Optional<User> createIfPrefect (boolean prefect, Set<String> emails) {
    if (!prefect) {
      return Optional.empty ();
    }

    var created = new User (null, null, UNKNOWN_PREFECT, emails);
    var creation = new UserCreation (
        new BaseAction (clock, "Auto-creating prefect."),
        created
    );
    userActionRepository.save (creation);
    return Optional.of (creation.apply (null));
  }

}
