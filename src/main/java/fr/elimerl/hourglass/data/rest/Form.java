package fr.elimerl.hourglass.data.rest;

public class Form<T> {

  private String comment;

  private T object;

  public String getComment () {
    return comment;
  }

  public T getObject () {
    return object;
  }

}
