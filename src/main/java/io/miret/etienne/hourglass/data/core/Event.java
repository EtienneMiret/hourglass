package io.miret.etienne.hourglass.data.core;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.With;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@With
@Getter
@NoArgsConstructor (access = PRIVATE)
@AllArgsConstructor
public class Event {

  private UUID id;

  private String name;

  private LocalDate date;

  private UUID scaleRuleId;

  private Integer points;

  private Set<UUID> userIds;

}
