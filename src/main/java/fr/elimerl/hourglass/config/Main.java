package fr.elimerl.hourglass.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import java.time.Clock;
import java.time.ZoneId;

@EnableAutoConfiguration
@ComponentScan ("fr.elimerl.hourglass")
public class Main {

  public static void main (String[] args) {
    SpringApplication.run (Main.class, args);
  }

  @Bean
  public Clock clock () {
    return Clock.system (ZoneId.of ("Europe/Paris"));
  }

}
