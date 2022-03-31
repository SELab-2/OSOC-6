package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.BaseTestPerformer;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link UserEntity}.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachUserEndpointTests extends BaseTestPerformer<UserEntity, Long, UserRepository> {

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

    @Override
    public final Long get_id(final UserEntity entity) {
        return entity.getId();
    }

    @Override
    public final UserRepository get_repository() {
        return userRepository;
    }

    /**
     * Add test users to the database.
     */
    @Override
    public void setUpRepository() {
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
    }

    /**
     * Remove the two test users from the database.
     */
    @Override
    public void removeSetUpRepository() {
        if (userRepository.existsById(adminUser.getId())) {
            userRepository.deleteById(adminUser.getId());
        }
        if (userRepository.existsById(coachUser.getId())) {
            userRepository.deleteById(coachUser.getId());
        }
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_list_of_all_users_is_forbidden() throws Exception {
        perform_get(USERS_PATH)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_himself_succeeds() throws Exception {
        perform_get(USERS_PATH + "/" + coachUser.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(coachUser.getEmail()))
                .andExpect(string_to_contains_string(coachUser.getCallName()))
                .andExpect(string_to_contains_string(coachUser.getUserRole().toString()));
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_other_user_is_forbidden() throws Exception {
        perform_get(USERS_PATH + "/" + adminUser.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_nonexisting_user_is_forbidden() throws Exception {
        int id = 1234;
        perform_get(USERS_PATH + "/" + id)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_role_with_valid_role_is_forbidden() throws Exception {
        UserRole newRole = UserRole.COACH;
        Map<String, String> map = Map.of("userRole", newRole.toString());
        perform_patch(USERS_PATH +  "/" + adminUser.getId(), map)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_role_with_invalid_role_is_forbidden() throws Exception {
        String newRole = "LORD";
        Map<String, String> map = Map.of("userRole", newRole);
        perform_patch(USERS_PATH + "/" + adminUser.getId(), map)
                .andExpect(status().isForbidden());
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
        perform_patch(USERS_PATH + "/" + coachUser.getId(), map)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + coachUser.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newEmail))
                .andExpect(string_to_contains_string(newCallName))
                .andExpect(string_to_contains_string(coachUser.getUserRole().toString()));
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
        perform_patch(USERS_PATH + "/" + adminUser.getId(), map)
                .andExpect(status().isForbidden());
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
        perform_patch(USERS_PATH + "/" + coachUser.getId(), map)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "coach.test@gmail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_delete_user_is_forbidden() throws Exception {
        perform_delete_with_id(USERS_PATH, adminUser.getId())
                .andExpect(status().isForbidden());
    }
}