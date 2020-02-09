package io.miret.etienne.hourglass.data.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class User {

  private final UUID id;

  private final String name;

  private final boolean prefect;

}
