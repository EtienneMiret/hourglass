package fr.elimerl.hourglass.repositories;

import fr.elimerl.hourglass.data.mongo.UserAction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface UserActionRepository extends MongoRepository<UserAction, String> {

  Set<UserAction> findByUserId (UUID id);

  Set<UserAction> findByUserIdIn (Set<UUID> ids);

  Set<UserAction> findByEmailsContaining (String email);

}
