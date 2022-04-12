package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.TestFunctionProvider;
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
 * Class testing the integration of {@link UserEntity} as a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachUserEndpointTests extends TestFunctionProvider<UserEntity, Long, UserRepository> {

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
     * The string that will be set on a POST or PATCH and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Test Callname";

    @Override
    public UserEntity create_entity() {
        UserEntity userEntity = TestEntityProvider.getBaseCoachUserEntity(this);
        userEntity.setCallName(TEST_STRING);
        return userEntity;
    }

    @Override
    public Map<String, String> change_entity(final UserEntity startEntity) {
        return Map.of("callName", TEST_STRING);
    }

    public CoachUserEndpointTests() {
        super(USERS_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(final UserEntity entity) {
        return entity.getId();
    }

    @Override
    public UserRepository get_repository() {
        return userRepository;
    }

    /**
     * Add test users to the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();
    }

    /**
     * Remove test users from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeBasicData();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_list_of_all_users_is_forbidden() throws Exception {
        perform_get(USERS_PATH)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_himself_succeeds() throws Exception {
        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getCoachUser().getEmail()))
                .andExpect(string_to_contains_string(getCoachUser().getCallName()))
                .andExpect(string_to_contains_string(getCoachUser().getUserRole().toString()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_other_user_is_ok() throws Exception {
        perform_get(USERS_PATH + "/" + getAdminUser().getId())
                .andExpect(status().isOk());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_get_details_of_nonexisting_user_is_not_found() throws Exception {
        int id = 1234;
        perform_get(USERS_PATH + "/" + id)
                .andExpect(status().isNotFound());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_role_with_valid_role_is_forbidden() throws Exception {
        UserRole newRole = UserRole.COACH;
        Map<String, String> map = Map.of("userRole", newRole.toString());
        perform_patch(USERS_PATH +  "/" + getAdminUser().getId(), map)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_role_with_invalid_role_is_forbidden() throws Exception {
        String newRole = "LORD";
        Map<String, String> map = Map.of("userRole", newRole);
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), map)
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_profile_of_himself_succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName
        );
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), map)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newEmail))
                .andExpect(string_to_contains_string(newCallName))
                .andExpect(string_to_contains_string(getCoachUser().getUserRole().toString()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_profile_of_other_user_is_forbidden() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName
        );
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), map)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_update_profile_and_role_is_forbidden() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName,
                "userRole", newRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), map)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_delete_user_is_forbidden() throws Exception {
        perform_delete_with_id(USERS_PATH, getCoachUser().getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_coach_user_works() throws Exception {
        perform_get(getEntityPath() + "/search/" + DumbledorePathWizard.OWN_USERS_PATH)
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getCoachUser().getCallName()));
    }

    @Test
    @WithUserDetails(value = MATCHING_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_sees_same_edition_by_email() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.USERS_BY_EMAIL_PATH,
                new String[]{"email"}, new String[]{getCoachUser().getEmail()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getCoachUser().getCallName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_does_NOT_see_other_edition_by_email() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.USERS_BY_EMAIL_PATH,
                new String[]{"email"}, new String[]{getCoachUser().getEmail()})
                .andExpect(status().isForbidden())
                .andExpect(string_not_to_contains_string(getCoachUser().getCallName()));
    }

    @Test
    @WithUserDetails(value = MATCHING_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_sees_same_edition_by_id() throws Exception {
        perform_get(getEntityPath() + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getCoachUser().getCallName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void coach_does_NOT_see_other_edition_by_id() throws Exception {
        perform_get(getEntityPath() + "/" + getCoachUser().getId())
                .andExpect(status().isForbidden());
    }
}
