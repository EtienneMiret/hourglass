package io.miret.etienne.hourglass.repositories;

import io.miret.etienne.hourglass.data.mongo.TeamAction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface TeamActionRepository extends MongoRepository<TeamAction, String> {

  Set<TeamAction> findByTeamId (UUID id);

}
