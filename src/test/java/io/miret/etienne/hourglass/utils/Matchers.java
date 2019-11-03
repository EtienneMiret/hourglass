package io.miret.etienne.hourglass.utils;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeDiagnosingMatcher;

public class Matchers {

  @SafeVarargs
  public static <I, C extends Iterable<I>> Matcher<C> containsInAnyOrder (I... items) {
    Matcher<Iterable<? extends I>> iterableMatcher =
        org.hamcrest.Matchers.containsInAnyOrder (items);
    return wrap (iterableMatcher);
  }

  @SafeVarargs
  public static <I, C extends Iterable<I>> Matcher<C> contains (Matcher<I>... items) {
    Matcher<Iterable<? extends I>> iterableMatcher =
        org.hamcrest.Matchers.contains (items);
    return wrap (iterableMatcher);
  }

  private static <I, C extends Iterable<I>> Matcher<C> wrap (Matcher<Iterable<? extends I>> iterableMatcher) {
    return new TypeSafeDiagnosingMatcher<> () {

      @Override
      protected boolean matchesSafely (C item, Description mismatchDescription) {
        if (iterableMatcher.matches (item)) {
          return true;
        } else {
          iterableMatcher.describeMismatch (item, mismatchDescription);
          return false;
        }
      }

      @Override
      public void describeTo (Description description) {
        iterableMatcher.describeTo (description);
      }

    };
  }

}
