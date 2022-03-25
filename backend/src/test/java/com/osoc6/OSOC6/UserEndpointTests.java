package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link UserEntity}.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class UserEndpointTests {

    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private UserRepository userRepository;

//    @Autowired
//    private MessageSource messageSource;

    /**
     * The actual path users are served on, with '/' as prefix.
     */
    private static final String USERS_PATH = "/" + DumbledorePathWizard.USERS_PATH;

    /**
     * First sample user that gets loaded before every test.
     */
    private final UserEntity user1 = new UserEntity();
    /**
     * Second sample user that gets loaded before every test.
     */
    private final UserEntity user2 = new UserEntity();

    /**
     * Fill in the data of the test users and add them to the database.
     */
    @BeforeEach
    public void setUp() {
        // Since the userRepository is secured,
        // we need to create a temporary authentication token to be able to save the test users
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ROLE_ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        user1.setEmail("user1.test@gmail.com");
        user1.setCallName("User1 Test");
        user1.setUserRole(UserRole.ADMIN);
        user1.setPassword("123456");
        userRepository.save(user1);

        user2.setEmail("user2.tester@hotmail.com");
        user2.setCallName("User2 Test");
        user2.setUserRole(UserRole.DISABLED);
        userRepository.save(user2);

        // After saving the test users, we clear the security context as to not interfere with any remaining tests.
        SecurityContextHolder.clearContext();
    }

    /**
     * Remove the two test users from the database.
     */
    @AfterEach
    public void removeTestUsers() {
        // Since the userRepository is secured,
        // we need to create a temporary authentication token to be able to delete the test users
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(new TestingAuthenticationToken(null, null, "ROLE_ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        if (userRepository.existsById(user1.getId())) {
            userRepository.deleteById(user1.getId());
        }
        if (userRepository.existsById(user2.getId())) {
            userRepository.deleteById(user2.getId());
        }

        // After deleting the test users, we clear the security context as to not interfere with any remaining tests.
        SecurityContextHolder.clearContext();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void admin_get_list_of_all_users_contains_both_test_users() throws Exception {
        mockMvc.perform(get(USERS_PATH))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(user1.getEmail())))
                .andExpect(content().string(containsString(user2.getEmail())));
    }

    @Test
    @WithMockUser(username = "coach", roles = {"COACH"})
    public void coach_get_list_of_all_users_fails() throws Exception {
        mockMvc.perform(get(USERS_PATH))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void admin_get_details_of_test_user1_succeeds() throws Exception {
        mockMvc.perform(get("/users/" + user1.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(user1.getEmail())))
                .andExpect(content().string(containsString(user1.getCallName())))
                .andExpect(content().string(containsString(user1.getUserRole().toString())));
    }

    @Test
    public void coach_get_details_of_himself_succeeds() throws Exception {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(user1, "123456"));
        SecurityContextHolder.setContext(securityContext);
        mockMvc.perform(get("/users/" + user1.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(user1.getEmail())))
                .andExpect(content().string(containsString(user1.getCallName())))
                .andExpect(content().string(containsString(user1.getUserRole().toString())));
        SecurityContextHolder.clearContext();
    }

    @Test
    @WithMockUser(username = "coach", roles = {"COACH"})
    public void coach_get_details_of_other_user_fails() throws Exception {
        mockMvc.perform(get("/users/" + user1.getId()))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

//    @Test
//    public void get_details_of_test_user2_succeeds() throws Exception {
//        mockMvc.perform(get("/users/" + user2.getId()))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().string(containsString(user2.getEmail())))
//                .andExpect(content().string(containsString(user2.getCallName())))
//                .andExpect(content().string(containsString(user2.getUserRole().toString())));
//    }
//
//    @Test
//    public void get_details_of_nonexisting_user_fails() throws Exception {
//        int id = 1234;
//        mockMvc.perform(get("/users/" + id))
//                .andDo(print())
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    public void update_role_test_user1_with_valid_role_succeeds() throws Exception {
//        String newRole = "COACH";
//        Map<String, String> map = Map.of("userRole", newRole);
//        mockMvc.perform(patch("/users/" + user1.getId() + "/update-role")
//                        .content(asJsonString(map))
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().string(containsString(user1.getEmail())))
//                .andExpect(content().string(containsString(user1.getCallName())))
//                .andExpect(content().string(containsString(newRole)));
//    }
//
//    @Test
//    public void update_role_test_user1_with_invalid_role_fails() throws Exception {
//        String newRole = "LORD";
//        Map<String, String> map = Map.of("userRole", newRole);
//        mockMvc.perform(patch("/users/" + user1.getId() + "/update-role")
//                        .content(asJsonString(map))
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(containsString(
//                        messageSource.getMessage("userrole.valid", null, Locale.getDefault()))));
//    }
//
//    @Test
//    public void update_role_test_user1_without_role_fails() throws Exception {
//        Map<String, String> map = Map.of("something", "else");
//        mockMvc.perform(patch("/users/" + user1.getId() + "/update-role")
//                        .content(asJsonString(map))
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(containsString(
//                        messageSource.getMessage("userrole.valid", null, Locale.getDefault()))));
//    }
//
//    @Test
//    public void update_profile_test_user1_with_valid_data_succeeds() throws Exception {
//        String newEmail = "newemail.test@gmail.com";
//        String newFirstName = "newFirstName";
//        String newLastName = "newLastName";
//        Map<String, String> map = Map.of(
//                "email", newEmail,
//                "firstName", newFirstName,
//                "lastName", newLastName
//        );
//        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
//                        .content(asJsonString(map))
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().string(containsString(newEmail)))
//                .andExpect(content().string(containsString(newFirstName)))
//                .andExpect(content().string(containsString(newLastName)))
//                .andExpect(content().string(containsString(user1.getUserRole().toString())));
//    }
//
//    @Test
//    public void update_profile_test_user1_with_invalid_email_fails() throws Exception {
//        String newEmail = "notanemail";
//        String newFirstName = "newFirstName";
//        String newLastName = "newLastName";
//        Map<String, String> map = Map.of(
//                "email", newEmail,
//                "firstName", newFirstName,
//                "lastName", newLastName
//        );
//        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
//                        .content(asJsonString(map))
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(containsString(
//                        messageSource.getMessage("email.valid", null, Locale.getDefault()))));
//    }
//
//    @Test
//    public void update_profile_test_user1_without_email_fails() throws Exception {
//        String newFirstName = "newFirstName";
//        String newLastName = "newLastName";
//        Map<String, String> map = Map.of(
//                "firstName", newFirstName,
//                "lastName", newLastName
//        );
//        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
//                        .content(asJsonString(map))
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(containsString(
//                        messageSource.getMessage("email.notempty", null, Locale.getDefault()))));
//    }
//
//    @Test
//    public void update_profile_test_user1_without_callname_fails() throws Exception {
//        String newEmail = "newemail.test@gmail.com";
//        String newCallName = "Call name";
//        Map<String, String> map = Map.of(
//                "email", newEmail,
//                "callName", newCallName
//        );
//        mockMvc.perform(patch("/users/" + user1.getId() + "/update-profile")
//                        .content(asJsonString(map))
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(containsString(
//                        messageSource.getMessage("firstname.notempty", null, Locale.getDefault()))));
//    }
//
//    @Test
//    public void delete_test_user1_succeeds() throws Exception {
//        mockMvc.perform(delete("/users/" + user1.getId()))
//                .andDo(print())
//                .andExpect(status().isNoContent());
//    }
}
