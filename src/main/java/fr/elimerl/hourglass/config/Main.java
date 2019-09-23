package fr.elimerl.hourglass.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.time.Clock;
import java.time.ZoneId;

@EnableAutoConfiguration
@EnableMongoRepositories ("fr.elimerl.hourglass.repositories")
@ComponentScan ("fr.elimerl.hourglass")
public class Main {

  public static void main (String[] args) {
    SpringApplication.run (Main.class, args);
  }

  @Bean
  public MongoClient mongoClient () {
    return MongoClients.create ();
  }

  @Bean
  public Clock clock () {
    return Clock.system (ZoneId.of ("Europe/Paris"));
  }

}
