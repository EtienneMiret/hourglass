package io.miret.etienne.hourglass.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.miret.etienne.hourglass.data.config.AppConfiguration;
import lombok.AllArgsConstructor;
import org.bson.codecs.UuidCodec;
import org.bson.codecs.configuration.CodecRegistries;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.Set;

import static org.bson.UuidRepresentation.STANDARD;

@Configuration
@AllArgsConstructor
@EnableMongoRepositories ("io.miret.etienne.hourglass.repositories")
public class Mongo extends AbstractMongoClientConfiguration {

  private final AppConfiguration configuration;

  @Bean
  @Nonnull
  @Override
  public MongoClient mongoClient () {
    MongoClientSettings settings = MongoClientSettings.builder ()
        .codecRegistry (CodecRegistries.fromRegistries (
            CodecRegistries.fromCodecs (new UuidCodec (STANDARD)),
            MongoClientSettings.getDefaultCodecRegistry ()
        ))
        .applyConnectionString (new ConnectionString (configuration.getMongo ()))
        .build ();
    return MongoClients.create (settings);
  }

  @Nonnull
  @Override
  protected String getDatabaseName () {
    return "hourglass";
  }

  @Nonnull
  @Override
  protected Collection<String> getMappingBasePackages () {
    return Set.of ("io.miret.etienne.hourglass.data.mongo");
  }

}
