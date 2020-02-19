package io.miret.etienne.hourglass.data.config;

import lombok.Getter;

@Getter
public class AppConfiguration {

  private SecurityConfiguration security;

  private String mongo;

}
