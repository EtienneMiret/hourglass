package io.miret.etienne.hourglass.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import io.miret.etienne.hourglass.data.config.AppConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;

import java.io.IOException;
import java.time.Clock;
import java.time.ZoneId;

@Configuration
@EnableAutoConfiguration
@ComponentScan ("io.miret.etienne.hourglass")
public class Main extends SpringBootServletInitializer {

  public static void main (String[] args) {
    SpringApplication.run (Main.class, args);
  }

  @Override
  protected SpringApplicationBuilder configure (SpringApplicationBuilder builder) {
    return  builder.sources (Main.class);
  }

  @Bean
  public AppConfiguration configuration () throws IOException {
    try (var app = Main.class.getResourceAsStream ("/application.yaml")) {
      return new ObjectMapper (new YAMLFactory ()).readerFor (AppConfiguration.class)
          .readValue (app);
    }
  }

  @Bean
  public Clock clock () {
    return Clock.system (ZoneId.of ("Europe/Paris"));
  }

  @Bean
  public OidcUserService oidcUserService () {
    return new OidcUserService ();
  }

}
