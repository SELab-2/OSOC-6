package com.osoc6.OSOC6.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RequestMapping("/auth")
@RestController
public class LoginController {
    @GetMapping("/home")
    public void getHome(HttpServletResponse response) {
        response.setHeader("Location", "/home");
        response.setStatus(302);
    }
}
