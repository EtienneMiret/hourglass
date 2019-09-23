package fr.elimerl.hourglass.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@EnableAutoConfiguration
@ComponentScan ("fr.elimerl.hourglass")
public class Main {

  public static void main (String[] args) {
    SpringApplication.run (Main.class, args);
  }

}
