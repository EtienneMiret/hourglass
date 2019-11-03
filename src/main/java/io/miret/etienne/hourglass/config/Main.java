package io.miret.etienne.hourglass.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

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
  public Clock clock () {
    return Clock.system (ZoneId.of ("Europe/Paris"));
  }

}
