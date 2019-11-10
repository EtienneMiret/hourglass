package io.miret.etienne.hourglass.config;

import io.miret.etienne.hourglass.data.config.AppConfiguration;
import io.miret.etienne.hourglass.data.config.SecurityConfiguration;
import lombok.AllArgsConstructor;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;

import java.util.Optional;

import static org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientPropertiesRegistrationAdapter.getClientRegistrations;

@Configuration
@AllArgsConstructor
public class Security extends WebSecurityConfigurerAdapter {

  private final AppConfiguration configuration;

  @Override
  protected void configure (HttpSecurity http) throws Exception {
    http
        .authorizeRequests ().anyRequest ().hasRole ("student").and ()
        .csrf ().disable ()
        .oauth2Login ();
  }

  @Bean
  public ClientRegistrationRepository clientRegistrationRepository () {
    var properties = new OAuth2ClientProperties ();
    Optional.ofNullable (configuration.getSecurity ())
        .map (SecurityConfiguration::getProviders)
        .ifPresent (properties.getProvider ()::putAll);
    Optional.ofNullable (configuration.getSecurity ())
        .map (SecurityConfiguration::getRegistrations)
        .ifPresent (properties.getRegistration ()::putAll);
    properties.validate ();
    return new InMemoryClientRegistrationRepository (
        getClientRegistrations (properties)
    );
  }

}

