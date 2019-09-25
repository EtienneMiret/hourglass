package fr.elimerl.hourglass.data.core;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Wither;

import java.util.Set;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@Wither
@Getter
@NoArgsConstructor (access = PRIVATE)
@AllArgsConstructor
public class Event {

  private UUID id;

  private String name;

  private UUID scaleRuleId;

  private Integer points;

  private Set<UUID> userIds;

}
