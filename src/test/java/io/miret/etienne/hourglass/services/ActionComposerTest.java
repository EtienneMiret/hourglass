package io.miret.etienne.hourglass.services;

import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Event;
import io.miret.etienne.hourglass.data.mongo.EventAction;
import io.miret.etienne.hourglass.data.mongo.EventCreation;
import io.miret.etienne.hourglass.data.mongo.EventEdition;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static com.google.common.collect.Collections2.permutations;
import static java.time.Month.FEBRUARY;
import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

class ActionComposerTest {

  private static final UUID SCALE_RULE_ID =
      UUID.fromString ("B7B8ACEE-0D71-4B68-A04E-EE98E5A97BB2");

  private static final UUID CHRISTINA =
      UUID.fromString ("8E5E0641-2C63-428D-9D92-59F234029308");
  private static final UUID CHRISTIAN =
      UUID.fromString ("729065A1-339D-4AB2-B4A5-3D8B8538E8BA");
  private static final UUID STEVEN =
      UUID.fromString ("759641CB-CB69-4444-8B45-74BFB4837539");

  private static final ZoneId ZONE_ID = ZoneId.of ("Europe/Paris");

  private final ActionComposer composer = new ActionComposer ();

  @Test
  void should_return_null_given_empty_collection () {
    var actual = composer.compose (emptySet ());

    assertThat (actual).isNull ();
  }

  @TestFactory
  Stream<DynamicTest> should_compose_actions_in_any_order_to_create_event () {
    var user = new AuthenticatedUser (
        UUID.fromString ("C7D99B0C-F71E-44C8-BAC2-8A6348F8BEFD"),
        null,
        "Admin",
        emptySet (),
        null
    );
    var creation = new EventCreation (
        new BaseAction (
            Clock.fixed (Instant.parse ("2019-11-01T11:15:18Z"), ZONE_ID),
            "Create event for Hackathon.",
            user
        ),
        new Event (
            null,
            "Hackathon",
            LocalDate.of (2020, FEBRUARY, 9),
            SCALE_RULE_ID,
            null,
            emptySet ()
        )
    );
    var edit1 = new EventEdition (
        new BaseAction (
            Clock.fixed (Instant.parse ("2019-11-01T18:20:31Z"), ZONE_ID),
            "Add Christian/",
            user
        ),
        new Event (
            creation.getEventId (),
            null,
            null,
            null,
            null,
            Set.of (CHRISTIAN)
        )
    );
    var edit2 = new EventEdition (
        new BaseAction (
            Clock.fixed (Instant.parse ("2019-11-01T18:32:24Z"), ZONE_ID),
            "Add Christina.",
            user
        ),
        new Event (
            creation.getEventId (),
            null,
            null,
            null,
            null,
            Set.of (CHRISTINA, CHRISTIAN)
        )
    );
    var edit3 = new EventEdition (
        new BaseAction (
            Clock.fixed (Instant.parse ("2019-11-02T08:42:03Z"), ZONE_ID),
            "Replace Christian with Steve.",
            user
        ),
        new Event (
            creation.getEventId (),
            null,
            null,
            null,
            null,
            Set.of (CHRISTINA, STEVEN)
        )
    );
    var edit4 = new EventEdition (
        new BaseAction (
            Clock.fixed (Instant.parse ("2019-11-04T16:31:22Z"), ZONE_ID),
            "Rename to “2019 Hackathon”.",
            user
        ),
        new Event (
            creation.getEventId (),
            "2019 Hackathon",
            null,
            null,
            null,
            null
        )
    );
    var edits = List.of (creation, edit1, edit2, edit3, edit4);

    return permutations (IntStream.range (0, 5).boxed ().collect (toList ()))
        .stream ()
        .map (order -> should_compose_actions_in_given_order (order, edits, creation.getEventId ()));
  }

  private DynamicTest should_compose_actions_in_given_order (
      List<Integer> order,
      List<EventAction> edits,
      UUID id
  ) {
    return dynamicTest (order.toString (), () -> {
      var actions = order.stream ()
          .map (edits::get)
          .collect (toList ());

      var actual = composer.compose (actions);

      assertThat (actual.getId ()).isEqualTo (id);
      assertThat (actual.getName ()).isEqualTo ("2019 Hackathon");
      assertThat (actual.getDate ())
          .isEqualTo (LocalDate.of (2020, FEBRUARY, 9));
      assertThat (actual.getScaleRuleId ()).isEqualTo (SCALE_RULE_ID);
      assertThat (actual.getUserIds ()).containsOnly (CHRISTINA, STEVEN);
    });
  }

}
