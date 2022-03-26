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
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static com.osoc6.OSOC6.Util.asJsonString;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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

    /**
     * The actual path users are served on, with '/' as prefix.
     */
    private static final String USERS_PATH = "/" + DumbledorePathWizard.USERS_PATH;

    /**
     * The admin sample user that gets loaded before every test.
     */
    private final UserEntity adminUser = new UserEntity();
    /**
     * The coach sample user that gets loaded before every test.
     */
    private final UserEntity coachUser = new UserEntity();

    /**
     * Fill in the data of the test users and add them to the database.
     */
    @BeforeEach
    public void setUp() {
        // Since the userRepository is secured,
        // we need to create a temporary authentication token to be able to save the test users
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        adminUser.setEmail("admin.test@gmail.com");
        adminUser.setCallName("Admin Test");
        adminUser.setUserRole(UserRole.ADMIN);
        adminUser.setPassword("123456");
        userRepository.save(adminUser);

        coachUser.setEmail("coach.test@gmail.com");
        coachUser.setCallName("Coach Test");
        coachUser.setUserRole(UserRole.COACH);
        coachUser.setPassword("123456");
        userRepository.save(coachUser);

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
        securityContext.setAuthentication(new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        if (userRepository.existsById(adminUser.getId())) {
            userRepository.deleteById(adminUser.getId());
        }
        if (userRepository.existsById(coachUser.getId())) {
            userRepository.deleteById(coachUser.getId());
        }

        // After deleting the test users, we clear the security context as to not interfere with any remaining tests.
        SecurityContextHolder.clearContext();
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_list_of_all_users_contains_both_test_users() throws Exception {
        mockMvc.perform(get(USERS_PATH))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(adminUser.getEmail())))
                .andExpect(content().string(containsString(coachUser.getEmail())));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_list_of_all_users_is_forbidden() throws Exception {
        mockMvc.perform(get(USERS_PATH))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_details_of_himself_succeeds() throws Exception {
        mockMvc.perform(get("/users/" + adminUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(adminUser.getEmail())))
                .andExpect(content().string(containsString(adminUser.getCallName())))
                .andExpect(content().string(containsString(adminUser.getUserRole().toString())));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_himself_succeeds() throws Exception {
        mockMvc.perform(get("/users/" + coachUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(coachUser.getEmail())))
                .andExpect(content().string(containsString(coachUser.getCallName())))
                .andExpect(content().string(containsString(coachUser.getUserRole().toString())));
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_details_of_other_user_succeeds() throws Exception {
        mockMvc.perform(get("/users/" + coachUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(coachUser.getEmail())))
                .andExpect(content().string(containsString(coachUser.getCallName())))
                .andExpect(content().string(containsString(coachUser.getUserRole().toString())));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_other_user_is_forbidden() throws Exception {
        mockMvc.perform(get("/users/" + adminUser.getId()))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_details_of_nonexisting_user_is_not_found() throws Exception {
        int id = 1234;
        mockMvc.perform(get("/users/" + id))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_nonexisting_user_is_forbidden() throws Exception {
        int id = 1234;
        mockMvc.perform(get("/users/" + id))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_role_with_valid_role_succeeds() throws Exception {
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> map = Map.of("userRole", newRole.toString());
        mockMvc.perform(patch("/users/" + coachUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(get("/users/" + coachUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(coachUser.getEmail())))
                .andExpect(content().string(containsString(coachUser.getCallName())))
                .andExpect(content().string(containsString(newRole.toString())));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_role_with_valid_role_is_forbidden() throws Exception {
        UserRole newRole = UserRole.COACH;
        Map<String, String> map = Map.of("userRole", newRole.toString());
        mockMvc.perform(patch("/users/" + adminUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_role_with_invalid_role_is_bad_request() throws Exception {
        String newRole = "LORD";
        Map<String, String> map = Map.of("userRole", newRole);
        mockMvc.perform(patch("/users/" + adminUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_role_with_invalid_role_is_forbidden() throws Exception {
        String newRole = "LORD";
        Map<String, String> map = Map.of("userRole", newRole);
        mockMvc.perform(patch("/users/" + adminUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_profile_of_himself_succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName
        );
        mockMvc.perform(patch("/users/" + adminUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(get("/users/" + adminUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(newEmail)))
                .andExpect(content().string(containsString(newCallName)))
                .andExpect(content().string(containsString(adminUser.getUserRole().toString())));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_profile_of_himself_succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName
        );
        mockMvc.perform(patch("/users/" + coachUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(get("/users/" + coachUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(newEmail)))
                .andExpect(content().string(containsString(newCallName)))
                .andExpect(content().string(containsString(coachUser.getUserRole().toString())));
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_profile_of_other_user_succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName
        );
        mockMvc.perform(patch("/users/" + coachUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(get("/users/" + coachUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(newEmail)))
                .andExpect(content().string(containsString(newCallName)))
                .andExpect(content().string(containsString(coachUser.getUserRole().toString())));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_profile_of_other_user_is_forbidden() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName
        );
        mockMvc.perform(patch("/users/" + adminUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_profile_and_role_succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        UserRole newRole = UserRole.COACH;
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName,
                "userRole", newRole.toString()
        );
        mockMvc.perform(patch("/users/" + adminUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(get("/users/" + adminUser.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(newEmail)))
                .andExpect(content().string(containsString(newCallName)))
                .andExpect(content().string(containsString(newRole.toString())));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_profile_and_role_is_forbidden() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName,
                "userRole", newRole.toString()
        );
        mockMvc.perform(patch("/users/" + coachUser.getId())
                        .content(asJsonString(map))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "admin.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_delete_user_succeeds() throws Exception {
        mockMvc.perform(delete("/users/" + coachUser.getId()))
                .andDo(print())
                .andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_delete_user_is_forbidden() throws Exception {
        mockMvc.perform(delete("/users/" + adminUser.getId()))
                .andDo(print())
                .andExpect(status().isForbidden());
    }
}
