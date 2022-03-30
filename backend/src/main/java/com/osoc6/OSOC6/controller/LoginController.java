package com.osoc6.OSOC6.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequestMapping("/auth")
@RestController
public class LoginController {
    @GetMapping("/home")
    public void succesfullAuthentication(HttpServletResponse response) {
        response.setHeader("Location", "/home");
        response.setStatus(302);
    }

    @PostMapping("/failure")
    public void handleFailure(HttpServletResponse response) {
        response.setHeader("Location", "/login_error");
        response.setStatus(302);
    }
}
