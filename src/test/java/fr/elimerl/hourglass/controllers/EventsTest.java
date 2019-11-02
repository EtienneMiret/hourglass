package fr.elimerl.hourglass.controllers;

import fr.elimerl.hourglass.data.core.BaseAction;
import fr.elimerl.hourglass.data.core.Event;
import fr.elimerl.hourglass.data.mongo.EventAction;
import fr.elimerl.hourglass.data.mongo.EventCreation;
import fr.elimerl.hourglass.data.mongo.EventEdition;
import fr.elimerl.hourglass.repositories.EventActionRepository;
import fr.elimerl.hourglass.repositories.ScaleRuleActionRepository;
import fr.elimerl.hourglass.services.ActionComposer;
import fr.elimerl.hourglass.utils.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import static java.util.Collections.emptySet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

@ExtendWith (MockitoExtension.class)
class EventsTest {

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

  @Test
  void should_list_all_events () {
    var event0Edit0 = new EventCreation (
        new BaseAction (clock, "foo"),
        new Event (null, null, null, null, emptySet ())
    );
    var event0Edit1 = new EventEdition (
        new BaseAction (clock, "bar"),
        new Event (event0Edit0.getEventId (), null, null, null, emptySet ())
    );
    var event1Edit0 = new EventCreation (
        new BaseAction (clock, "foo"),
        new Event (null, null, null, null, emptySet ())
    );
    var event2Edit0 = new EventCreation (
        new BaseAction (clock, "baz"),
        new Event (null, null, null, null, emptySet ())
    );
    var event2Edit1 = new EventEdition (
        new BaseAction (clock, "bar"),
        new Event (event2Edit0.getEventId (), null, null, null, emptySet ())
    );
    var event2Edit2 = new EventEdition (
        new BaseAction (clock, "foo"),
        new Event (event2Edit0.getEventId (), null, null, null, emptySet ())
    );
    var event0 = new Event (event0Edit0.getEventId (), "Hello World!", null, null, emptySet ());
    var event1 = new Event (event1Edit0.getEventId (), "How are you?", null, null, emptySet ());
    var event2 = new Event (event2Edit0.getEventId (), "I’m fine.", null, null, emptySet ());
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

}
