package io.miret.etienne.hourglass.data.core;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.With;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@With
@Getter
@AllArgsConstructor
@NoArgsConstructor (access = PRIVATE)
public class Team {

  private UUID id;

  private String name;

  private String color;

}
