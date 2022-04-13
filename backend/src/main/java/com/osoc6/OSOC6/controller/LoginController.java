package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

/**
 * This class handles the redirects caused by the login system.
 */
@RequestMapping("/" + DumbledorePathWizard.AUTH_PATH)
@RestController
public class LoginController {
    /**
     * Upon a successful authentication the user is redirected to the home page.
     * @param response response to the get request
     */
    @GetMapping("/" + DumbledorePathWizard.AUTH_HOME_PATH)
    public void succesfulAuthentication(final HttpServletResponse response) {
        response.setHeader("Location", "/home");
        response.setStatus(HttpServletResponse.SC_FOUND);
    }

    /**
     * Upon a failed authentication the user is redirected to the login_error page.
     * @param response response to the post request
     */
    @PostMapping("/" + DumbledorePathWizard.AUTH_FAIL_PATH)
    public void handleFailure(final HttpServletResponse response) {
        response.setHeader("Location", "/loginError");
        response.setStatus(HttpServletResponse.SC_FOUND);
    }
}
