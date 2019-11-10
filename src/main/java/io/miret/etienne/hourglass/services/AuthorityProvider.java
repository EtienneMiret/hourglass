package io.miret.etienne.hourglass.services;

import com.google.common.collect.Sets;
import io.miret.etienne.hourglass.data.config.AppConfiguration;
import io.miret.etienne.hourglass.data.config.SecurityConfiguration;
import io.miret.etienne.hourglass.data.core.User;
import io.miret.etienne.hourglass.data.mongo.UserAction;
import io.miret.etienne.hourglass.repositories.UserActionRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;

@Service
public class AuthorityProvider implements GrantedAuthoritiesMapper {

  private static final GrantedAuthority STUDENT =
      new SimpleGrantedAuthority ("ROLE_student");

  private static final GrantedAuthority PREFECT =
      new SimpleGrantedAuthority ("ROLE_prefect");

  private final UserActionRepository userActionRepository;

  private final ActionComposer composer;

  private final Set<String> prefects;

  public AuthorityProvider (
      UserActionRepository userActionRepository,
      ActionComposer composer,
      AppConfiguration configuration
  ) {
    this.userActionRepository = userActionRepository;
    this.composer = composer;
    this.prefects = Optional.ofNullable (configuration.getSecurity ())
        .map (SecurityConfiguration::getPrefects)
        .orElse (emptySet ());
  }

  @Override
  public Collection<? extends GrantedAuthority> mapAuthorities (
      Collection<? extends GrantedAuthority> authorities
  ) {
    Set<String> emails = authorities.stream ()
        .filter (OidcUserAuthority.class::isInstance)
        .map (OidcUserAuthority.class::cast)
        .map (OidcUserAuthority::getAttributes)
        .filter (Objects::nonNull)
        .map (attributes -> attributes.get ("email"))
        .filter (String.class::isInstance)
        .map (String.class::cast)
        .collect (toSet ());

    if (!Sets.intersection (emails, prefects).isEmpty ()) {
      return Set.of (STUDENT, PREFECT);
    }

    Set<String> registered = userActionRepository.findAll ()
          .stream ()
          .collect (groupingBy (UserAction::getUserId))
          .values ()
          .stream ()
          .map (composer::compose)
          .map (User::getEmails)
          .flatMap (Collection::stream)
          .collect (toSet ());

    if (!Sets.intersection (emails, registered).isEmpty ()) {
      return Set.of (STUDENT);
    }

    return emptySet ();
  }

}
