package io.miret.etienne.hourglass.data.auth;

import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
public class AuthenticatedUser implements OidcUser {

  public static final GrantedAuthority STUDENT =
      new SimpleGrantedAuthority ("ROLE_student");

  public static final GrantedAuthority PREFECT =
      new SimpleGrantedAuthority ("ROLE_prefect");

  public static final String UNKNOWN_PREFECT = "Prefect";

  private final UUID id;

  private final UUID teamId;

  private final String name;

  private final Collection<? extends GrantedAuthority> authorities;

  private final OidcUser delegate;

  public UUID getId () {
    return id;
  }

  public UUID getTeamId () {
    return teamId;
  }

  @Override
  public Map<String, Object> getAttributes () {
    return delegate.getAttributes ();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities () {
    return authorities;
  }

  @Override
  public String getName () {
    return name;
  }

  @Override
  public Map<String, Object> getClaims () {
    return delegate.getClaims ();
  }

  @Override
  public OidcUserInfo getUserInfo () {
    return delegate.getUserInfo ();
  }

  @Override
  public OidcIdToken getIdToken () {
    return delegate.getIdToken ();
  }

}
