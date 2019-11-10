package io.miret.etienne.hourglass.data.config;

import lombok.Getter;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;

import java.util.List;
import java.util.Map;

@Getter
public class SecurityConfiguration {

  private List<String> prefects;

  private Map<String, OAuth2ClientProperties.Registration> registrations;

  private Map<String, OAuth2ClientProperties.Provider> providers;

}
