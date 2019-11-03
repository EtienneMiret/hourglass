package io.miret.etienne.hourglass.filters;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter ("/*")
public class Router extends HttpFilter {

  @Override
  public void doFilter (
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain
  ) throws IOException, ServletException {
    if (isGetRequest (request)
        && acceptXhtml (request)
        && !isIndexXhtml (request)
    ) {
      sendIndex (request, response);
    } else {
      chain.doFilter (request, response);
    }
  }

  private boolean isGetRequest (HttpServletRequest request) {
    return request.getMethod ().equalsIgnoreCase ("GET")
        || request.getMethod ().equalsIgnoreCase ("HEAD");
  }

  private boolean acceptXhtml (HttpServletRequest request) {
    return MediaType.parseMediaTypes (request.getHeader (HttpHeaders.ACCEPT))
        .stream ()
        .filter (mediaType -> mediaType.getQualityValue () > 0)
        .anyMatch (MediaType.APPLICATION_XHTML_XML::includes);
  }

  private boolean isIndexXhtml (HttpServletRequest request) {
    return "/index.xhtml".equals (request.getPathInfo ());
  }

  private void sendIndex (ServletRequest request, ServletResponse response)
      throws ServletException, IOException {
    request.getRequestDispatcher ("/index.xhtml")
        .forward (request, response);
  }

}
