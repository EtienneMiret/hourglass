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
@AllArgsConstructor
@NoArgsConstructor (access = PRIVATE)
public class User {

  private UUID id;

  private String name;

  private Set<String> emails;

}
