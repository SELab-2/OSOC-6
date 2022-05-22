package com.osoc6.OSOC6.configurationTest;

import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * This test is used to check that the application uses https communication when in the production profile.
 */
@ActiveProfiles("production")
@SpringBootTest
@AutoConfigureMockMvc
public class ProductionUsesHttpsTest {
    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void sending_https_request_is_ok() throws Exception {
        mockMvc.perform(get("/" + DumbledorePathWizard.LOGIN_PATH).secure(true))
                .andExpect(status().isOk());
    }

    @Test
    public void sending_http_request_is_redirect() throws Exception {
        mockMvc.perform(get("/" + DumbledorePathWizard.LOGIN_PATH).secure(false))
                .andExpect(status().is3xxRedirection());
    }
}
