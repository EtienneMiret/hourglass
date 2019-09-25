package fr.elimerl.hourglass.repositories;

import fr.elimerl.hourglass.data.mongo.EventAction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface EventActionRepository extends MongoRepository<EventAction, String> {

  Set<EventAction> findByEventId (UUID id);

  Set<EventAction> findByEventIdIn (Set<UUID> ids);

  Set<EventAction> findByUserIdsContaining (UUID id);

}
