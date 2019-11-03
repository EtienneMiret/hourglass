package fr.elimerl.hourglass.controllers;

import fr.elimerl.hourglass.data.core.Event;
import fr.elimerl.hourglass.data.core.ScaleRule;
import fr.elimerl.hourglass.data.mongo.EventAction;
import fr.elimerl.hourglass.data.mongo.EventCreation;
import fr.elimerl.hourglass.data.mongo.ScaleRuleAction;
import fr.elimerl.hourglass.data.rest.Form;
import fr.elimerl.hourglass.repositories.EventActionRepository;
import fr.elimerl.hourglass.repositories.ScaleRuleActionRepository;
import fr.elimerl.hourglass.services.ActionComposer;
import fr.elimerl.hourglass.utils.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static org.springframework.test.util.ReflectionTestUtils.setField;

@ExtendWith (MockitoExtension.class)
class EventsTest_create {

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
  private ScaleRuleAction scaleRuleAction;

  @Captor
  private ArgumentCaptor<EventAction> eventCaptor;

  @Mock
  private ScaleRule scaleRule;

  private UUID eventId;
  private UUID scaleRuleId;
  private UUID gregory;
  private UUID steven;
  private String name;
  private Form<Event> form;

  @BeforeEach
  void createTestData () {
    eventId = UUID.fromString ("2CBF3B4D-7936-4DCE-B588-3E92383F4F32");
    scaleRuleId = UUID.fromString ("60EAE108-C9EB-435E-BCDE-E69A5019B682");
    gregory = UUID.fromString ("C9DA27E0-5F42-47B8-97B0-976ADA700B9F");
    steven = UUID.fromString ("7B4EF6D4-D7A2-4DB5-821A-62106149717E");
    name = "Spring break";
    var event = new Event (
        null,
        name,
        scaleRuleId,
        null,
        Set.of (gregory, steven)
    );
    form = new Form<> ();
    setField (form, "object", event);
    setField (form, "comment", "Hello World!");
  }

  @Test
  void should_fail_when_rule_does_not_exist () {
    assertThatThrownBy (() -> controller.create (form))
        .isInstanceOf (ResponseStatusException.class)
        .hasMessage ("400 BAD_REQUEST \"No such rule: 60eae108-c9eb-435e-bcde-e69a5019b682\"");
  }

  @Test
  void should_create_event () {
    when (clock.instant ()).thenReturn (Instant.parse ("2019-11-02T23:52:56Z"));
    when (scaleRuleActionRepository.findByScaleRuleId (scaleRuleId))
        .thenReturn (Set.of (scaleRuleAction));
    when (composer.compose (argThat (
        Matchers.<EventAction, Collection<EventAction>>contains (any (EventAction.class))
    )))
        .thenReturn (new Event (
            eventId,
            name,
            scaleRuleId,
            null,
            Set.of (gregory, steven)
        ));
    when (composer.compose (Set.of (scaleRuleAction)))
        .thenReturn (scaleRule);
    when (scaleRule.getPoints ()).thenReturn (2);

    Event actual = controller.create (form);

    verify (repository).save (eventCaptor.capture ());
    assertThat (eventCaptor.getValue ()).isInstanceOf (EventCreation.class);
    assertThat (eventCaptor.getValue ().getTimestamp ())
        .isEqualTo ("2019-11-02T23:52:56Z");
    assertThat (eventCaptor.getValue ().getComment ())
        .isEqualTo ("Hello World!");
    assertThat (eventCaptor.getValue ().getEventId ()).isNotNull ();
    assertThat (eventCaptor.getValue ().getName ()).isEqualTo (name);
    assertThat (eventCaptor.getValue ().getScaleRuleId ())
        .isEqualTo (scaleRuleId);
    assertThat (eventCaptor.getValue ().getUserIds ()).containsOnly (
        gregory, steven
    );
    assertThat (actual.getId ()).isEqualTo (eventId);
    assertThat (actual.getName ()).isEqualTo (name);
    assertThat (actual.getScaleRuleId ()).isEqualTo (scaleRuleId);
    assertThat (actual.getPoints ()).isEqualTo (2);
    assertThat (actual.getUserIds ()).containsOnly (gregory, steven);
  }

}
