package io.miret.etienne.hourglass.repositories;

import io.miret.etienne.hourglass.data.mongo.ScaleRuleAction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface ScaleRuleActionRepository extends MongoRepository<ScaleRuleAction, String> {

  Set<ScaleRuleAction> findByScaleRuleId (UUID id);

  Set<ScaleRuleAction> findByScaleRuleIdIn (Set<UUID> ids);

}
