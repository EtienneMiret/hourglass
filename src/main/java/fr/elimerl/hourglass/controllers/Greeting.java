package fr.elimerl.hourglass.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Greeting {

  @GetMapping (produces = MediaType.TEXT_PLAIN_VALUE)
  public String greet () {
    return "Hello World!";
  }

}
