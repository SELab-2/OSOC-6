package com.osoc6.OSOC6;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.osoc6.OSOC6.database.models.User;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Locale;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserEndpointTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageSource messageSource;

    private final User user1 = new User();
    private final User user2 = new User();

    /**
     * Add two test users to the database.
     */
    @BeforeEach
    public void setUp() {
        user1.setEmail("user1.test@gmail.com");
        user1.setFirstName("User1");
        user1.setLastName("Test");
        user1.setUserRole(UserRole.ADMIN);
        userRepository.save(user1);

        user2.setEmail("user2.toster@hotmail.com");
        user2.setFirstName("User2");
        user2.setLastName("Toster");
        user2.setUserRole(UserRole.DISABLED);
        userRepository.save(user2);
    }

    /**
     * Remove the two test users from the database.
     */
    @AfterEach
    public void removeTestUsers() {
        userRepository.deleteById(user1.getId());
        userRepository.deleteById(user2.getId());
    }

    @Test
    public void listContainsBothTestUsers() throws Exception {
        mockMvc.perform(get("/users"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(user1.getEmail())))
                .andExpect(content().string(containsString(user2.getEmail())));
    }

    @Test
    public void getDetailsOfTestUser1() throws Exception {
        mockMvc.perform(get("/users/" + user1.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(user1.getEmail())))
                .andExpect(content().string(containsString(user1.getFirstName())))
                .andExpect(content().string(containsString(user1.getLastName())))
                .andExpect(content().string(containsString(user1.getUserRole().toString())));
    }

    @Test
    public void getDetailsOfTestUser2() throws Exception {
        mockMvc.perform(get("/users/" + user2.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(user2.getEmail())))
                .andExpect(content().string(containsString(user2.getFirstName())))
                .andExpect(content().string(containsString(user2.getLastName())))
                .andExpect(content().string(containsString(user2.getUserRole().toString())));
    }

    @Test
    public void getDetailsOfNonexistingUser() throws Exception {
        int id = 1234;
        mockMvc.perform(get("/users/" + id))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateRoleTestUser1_WithValidRole_Succeeds() throws Exception {
        String newRole = "COACH";
        Map<String, String> map = Map.of("userRole", newRole);
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-role")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(user1.getEmail())))
                .andExpect(content().string(containsString(user1.getFirstName())))
                .andExpect(content().string(containsString(user1.getLastName())))
                .andExpect(content().string(containsString(newRole)));
    }

    @Test
    public void updateRoleTestUser1_WithInvalidRole_Fails() throws Exception {
        String newRole = "LORD";
        Map<String, String> map = Map.of("userRole", newRole);
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-role")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(
                        messageSource.getMessage("userrole.valid", null, any(Locale.class)))));
    }

    @Test
    public void updateRoleTestUser1_WithoutRole_Fails() throws Exception {
        Map<String, String> map = Map.of("something", "else");
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-role")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(
                        messageSource.getMessage("userrole.valid", null, any(Locale.class)))));
    }

    @Test
    public void updateProfileTestUser1_WithValidData_Succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newFirstName = "newFirstName";
        String newLastName = "newLastName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "firstName", newFirstName,
                "lastName", newLastName
        );
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(newEmail)))
                .andExpect(content().string(containsString(newFirstName)))
                .andExpect(content().string(containsString(newLastName)))
                .andExpect(content().string(containsString(user1.getUserRole().toString())));
    }

    @Test
    public void updateProfileTestUser1_WithInvalidEmail_Fails() throws Exception {
        String newEmail = "notanemail";
        String newFirstName = "newFirstName";
        String newLastName = "newLastName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "firstName", newFirstName,
                "lastName", newLastName
        );
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(
                        messageSource.getMessage("email.valid", null, any(Locale.class)))));
    }

    @Test
    public void updateProfileTestUser1_WithoutEmail_Fails() throws Exception {
        String newFirstName = "newFirstName";
        String newLastName = "newLastName";
        Map<String, String> map = Map.of(
                "firstName", newFirstName,
                "lastName", newLastName
        );
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(
                        messageSource.getMessage("email.notempty", null, any(Locale.class)))));
    }

    @Test
    public void updateProfileTestUser1_WithoutFirstName_Fails() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newLastName = "newLastName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "lastName", newLastName
        );
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(
                        messageSource.getMessage("firstname.notempty", null, any(Locale.class)))));
    }

    @Test
    public void updateProfileTestUser1_WithoutLastName_Fails() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newFirstName = "newFirstName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "firstName", newFirstName
        );
        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(
                        messageSource.getMessage("lastname.notempty", null, any(Locale.class)))));
    }

    /**
     * Transforms object to json string for a request.
     * @param obj object which needs to be converted to JSON
     * @return JSON string which contains the object
     */
    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper objMapper = new ObjectMapper();
            return objMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
