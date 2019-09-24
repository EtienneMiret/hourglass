package fr.elimerl.hourglass.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.Set;

@Configuration
@EnableMongoRepositories ("fr.elimerl.hourglass.repositories")
public class Mongo extends AbstractMongoClientConfiguration {

  @Bean
  @Nonnull
  @Override
  public MongoClient mongoClient () {
    return MongoClients.create ();
  }

  @Nonnull
  @Override
  protected String getDatabaseName () {
    return "hourglass";
  }

  @Nonnull
  @Override
  protected Collection<String> getMappingBasePackages () {
    return Set.of ("fr.elimerl.hourglass.data.mongo");
  }

}
