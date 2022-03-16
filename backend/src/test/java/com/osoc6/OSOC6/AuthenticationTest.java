package com.osoc6.OSOC6;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.FormLoginRequestBuilder;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.authenticated;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.unauthenticated;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void loginWithValidUser() throws Exception {
        FormLoginRequestBuilder login = formLogin().user("user").password("password");

        mockMvc.perform(login).andExpect(authenticated().withUsername("user"));
    }

    @Test
    public void loginWithInvalidUser() throws Exception {
        FormLoginRequestBuilder login = formLogin().user("invalid").password("invalid");

        mockMvc.perform(login).andExpect(unauthenticated());
    }

    @Test
    public void accessUnsecuredResource() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }
}
