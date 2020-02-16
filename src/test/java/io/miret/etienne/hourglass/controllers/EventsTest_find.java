package io.miret.etienne.hourglass.controllers;

import io.miret.etienne.hourglass.data.auth.AuthenticatedUser;
import io.miret.etienne.hourglass.data.core.BaseAction;
import io.miret.etienne.hourglass.data.core.Event;
import io.miret.etienne.hourglass.data.mongo.EventAction;
import io.miret.etienne.hourglass.data.mongo.EventCreation;
import io.miret.etienne.hourglass.data.mongo.EventEdition;
import io.miret.etienne.hourglass.repositories.EventActionRepository;
import io.miret.etienne.hourglass.repositories.ScaleRuleActionRepository;
import io.miret.etienne.hourglass.services.ActionComposer;
import io.miret.etienne.hourglass.utils.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static java.util.Collections.emptySet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

@ExtendWith (MockitoExtension.class)
class EventsTest_find {

  @InjectMocks
  private Events controller;

  @Mock
  private Clock clock;

  @Mock
  private EventActionRepository repository;

  @Mock
  private ScaleRuleActionRepository scaleRuleActionRepository;

  @Mock
  private ActionComposer composer;

  @Mock
  private AuthenticatedUser actor;

  private EventAction event0Edit0;
  private EventAction event0Edit1;
  private EventCreation event1Edit0;
  private EventCreation event2Edit0;
  private EventEdition event2Edit1;
  private EventEdition event2Edit2;
  private Event event0;
  private Event event1;
  private Event event2;

  @BeforeEach
  void createTestData () {
    event0Edit0 = new EventCreation (
        new BaseAction (clock, "foo", actor),
        new Event (null, null, null, null, null, emptySet ())
    );
    event0Edit1 = new EventEdition (
        new BaseAction (clock, "bar", actor),
        new Event (event0Edit0.getEventId (), null, null, null, null, emptySet ())
    );
    event1Edit0 = new EventCreation (
        new BaseAction (clock, "foo", actor),
        new Event (null, null, null, null, null, emptySet ())
    );
    event2Edit0 = new EventCreation (
        new BaseAction (clock, "baz", actor),
        new Event (null, null, null, null, null, emptySet ())
    );
    event2Edit1 = new EventEdition (
        new BaseAction (clock, "bar", actor),
        new Event (event2Edit0.getEventId (), null, null, null, null, emptySet ())
    );
    event2Edit2 = new EventEdition (
        new BaseAction (clock, "foo", actor),
        new Event (event2Edit0.getEventId (), null, null, null, null, emptySet ())
    );
    event0 = new Event (event0Edit0.getEventId (), "Hello World!", null, null, null, emptySet ());
    event1 = new Event (event1Edit0.getEventId (), "How are you?", null, null, null, emptySet ());
    event2 = new Event (event2Edit0.getEventId (), "I’m fine.", null, null, null, emptySet ());
  }

  @Test
  void should_list_all_events () {
    when (repository.findAll ()).thenReturn (List.of (
        event0Edit1,
        event2Edit2,
        event0Edit0,
        event1Edit0,
        event2Edit0,
        event2Edit1
    ));
    when (composer.compose (argThat (
        Matchers.<EventAction, Collection<EventAction>>containsInAnyOrder (event0Edit0, event0Edit1)
    ))).thenReturn (event0);
    when (composer.compose (argThat (
        Matchers.<EventAction, Collection<EventAction>>containsInAnyOrder (event1Edit0)
    ))).thenReturn (event1);
    when (composer.compose (argThat (
        Matchers.<EventAction, Collection<EventAction>>containsInAnyOrder (event2Edit0, event2Edit1, event2Edit2)
    ))).thenReturn (event2);

    Set<Event> actual = controller.find (null);

    assertThat (actual).containsOnly (event0, event1, event2);
  }

  @Test
  void should_list_events_for_a_user () {
    var userID = UUID.fromString ("26DCF1E9-6C9C-4FF4-B9DB-6E935D4D0F37");
    when (repository.findByUserIdsContaining (userID)).thenReturn (Set.of (
        event0Edit0,
        event1Edit0,
        event2Edit0
    ));
    when (repository.findByEventIdIn (Set.of (
        event0Edit0.getEventId (),
        event1Edit0.getEventId (),
        event2Edit0.getEventId ()
    ))).thenReturn (Set.of (
        event0Edit0,
        event0Edit1,
        event1Edit0,
        event2Edit0,
        event2Edit1,
        event2Edit2
    ));
    when (composer.compose (argThat (
        Matchers.<EventAction, Collection<EventAction>>containsInAnyOrder (event0Edit0, event0Edit1)
    ))).thenReturn (event0);
    when (composer.compose (argThat (
        Matchers.<EventAction, Collection<EventAction>>containsInAnyOrder (event1Edit0)
    ))).thenReturn (event1);
    when (composer.compose (argThat (
        Matchers.<EventAction, Collection<EventAction>>containsInAnyOrder (event2Edit0, event2Edit1, event2Edit2)
    ))).thenReturn (event2);

    Set<Event> actual = controller.find (userID);

    assertThat (actual).containsOnly (event0, event1, event2);
  }

}
