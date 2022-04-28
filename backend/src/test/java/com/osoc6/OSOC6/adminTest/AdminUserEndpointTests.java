package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.dto.UserDTO;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link UserEntity} as an admin.
 */
public class AdminUserEndpointTests extends AdminEndpointTest<UserEntity, Long, UserRepository> {

    /**
     * The repository which saves, searches, ... {@link UserEntity} in the database.
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Entity links, needed to get the link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * The actual path users are served on, with '/' as prefix.
     */
    private static final String USERS_PATH = "/" + DumbledorePathWizard.USERS_PATH;

    /**
     * The string that will be set on a POST or PATCH and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Test Callname";

    public AdminUserEndpointTests() {
        super(USERS_PATH, TEST_STRING);
    }

    /**
     * Add test users to the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();
    }

    /**
     * Remove test user from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeBasicData();
    }

    @Override
    public final String transform_to_json(final UserEntity entity) {
        UserDTO helper = new UserDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    @Override
    public final UserEntity create_entity() {
        UserEntity userEntity = TestEntityProvider.getBaseAdminUserEntity(this);
        userEntity.setCallName(TEST_STRING);
        return userEntity;
    }

    @Override
    public final Map<String, String> change_entity(final UserEntity startEntity) {
        return Map.of("callName", TEST_STRING);
    }

    @Override
    public final UserRepository get_repository() {
        return userRepository;
    }

    @Override
    public final Long get_id(final UserEntity entity) {
        return entity.getId();
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_list_of_all_users_contains_both_test_users() throws Exception {
        perform_get(USERS_PATH)
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getAdminUser().getEmail()))
                .andExpect(string_to_contains_string(getCoachUser().getEmail()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_details_of_himself_succeeds() throws Exception {
        perform_get(USERS_PATH + "/" + getAdminUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getAdminUser().getEmail()))
                .andExpect(string_to_contains_string(getAdminUser().getCallName()))
                .andExpect(string_to_contains_string(getAdminUser().getUserRole().toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_details_of_other_user_succeeds() throws Exception {
        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getCoachUser().getEmail()))
                .andExpect(string_to_contains_string(getCoachUser().getCallName()))
                .andExpect(string_to_contains_string(getCoachUser().getUserRole().toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_get_details_of_nonexisting_user_is_not_found() throws Exception {
        int id = 1234;
        perform_get(USERS_PATH + "/" + id)
                .andExpect(status().isNotFound());
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void final_admin_update_other_role_with_valid_role_succeeds() throws Exception {
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> map = Map.of("userRole", newRole.toString());
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), map)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getCoachUser().getEmail()))
                .andExpect(string_to_contains_string(getCoachUser().getCallName()))
                .andExpect(string_to_contains_string(newRole.toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void final_admin_update_own_role_with_valid_role_fails() throws Exception {
        UserRole newRole = UserRole.COACH;
        Map<String, String> map = Map.of("userRole", newRole.toString());
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), map)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void non_final_admin_update_other_role_with_valid_role_succeeds() throws Exception {
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> map = Map.of("userRole", newRole.toString());
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), map)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getCoachUser().getEmail()))
                .andExpect(string_to_contains_string(getCoachUser().getCallName()))
                .andExpect(string_to_contains_string(newRole.toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void non_final_admin_update_own_role_with_valid_role_succeeds() throws Exception {
        // Set coachUser to admin
        UserRole newAdminRole = UserRole.ADMIN;
        Map<String, String> newMap = Map.of(
                "userRole", newAdminRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), newMap)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newAdminRole.toString()));

        // Admin update own role
        UserRole newCoachRole = UserRole.COACH;
        Map<String, String> map = Map.of("userRole", newCoachRole.toString());
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), map)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getAdminUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getAdminUser().getEmail()))
                .andExpect(string_to_contains_string(getAdminUser().getCallName()))
                .andExpect(string_to_contains_string(newCoachRole.toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_role_with_invalid_role_is_bad_request() throws Exception {
        String newRole = "LORD";
        Map<String, String> map = Map.of("userRole", newRole);
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), map)
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_profile_of_himself_succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName
        );
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), map)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getAdminUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newEmail))
                .andExpect(string_to_contains_string(newCallName))
                .andExpect(string_to_contains_string(getAdminUser().getUserRole().toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_update_profile_of_other_user_succeeds() throws Exception {
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
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void final_admin_update_other_profile_and_role_succeeds() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName,
                "userRole", newRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), map)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newEmail))
                .andExpect(string_to_contains_string(newCallName))
                .andExpect(string_to_contains_string(newRole.toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void final_admin_update_own_profile_and_role_fails() throws Exception {
        String newEmail = "newemail.test@gmail.com";
        String newCallName = "newCallName";
        UserRole newRole = UserRole.COACH;
        Map<String, String> map = Map.of(
                "email", newEmail,
                "callName", newCallName,
                "userRole", newRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), map)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void not_final_admin_update_other_profile_and_role_succeeds() throws Exception {
        // Set coachUser to admin
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> newMap = Map.of(
                "userRole", newRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), newMap)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newRole.toString()));

        // Update coachUser profile and role
        String oldEmail = "old.test@e.com";
        String oldCallName = "oldName";
        UserRole oldRole = UserRole.COACH;
        Map<String, String> oldMap = Map.of(
                "email", oldEmail,
                "callName", oldCallName,
                "userRole", oldRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), oldMap)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(oldEmail))
                .andExpect(string_to_contains_string(oldCallName))
                .andExpect(string_to_contains_string(oldRole.toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void not_final_admin_update_own_profile_and_role_succeeds() throws Exception {
        // Set another user to admin
        UserRole newRole = UserRole.ADMIN;
        Map<String, String> newMap = Map.of(
                "userRole", newRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getCoachUser().getId(), newMap)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getCoachUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newRole.toString()));

        // Update own profile and role
        String newOwnEmail = "mynewmail@mail.com";
        String newOwnCallName = "my new callname";
        UserRole newOwnRole = UserRole.COACH;
        Map<String, String> newOwnmap = Map.of(
                "email", newOwnEmail,
                "callName", newOwnCallName,
                "userRole", newOwnRole.toString()
        );
        perform_patch(USERS_PATH + "/" + getAdminUser().getId(), newOwnmap)
                .andExpect(status().is2xxSuccessful());

        perform_get(USERS_PATH + "/" + getAdminUser().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(newOwnEmail))
                .andExpect(string_to_contains_string(newOwnCallName))
                .andExpect(string_to_contains_string(newOwnRole.toString()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_delete_user_succeeds() throws Exception {
        perform_delete_with_id(USERS_PATH, getCoachUser().getId())
                .andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_admin_user_works() throws Exception {
        perform_get(getEntityPath() + "/search/" + DumbledorePathWizard.OWN_USERS_PATH)
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getAdminUser().getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_sees_other_edition_coach_by_email() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.USERS_BY_EMAIL_PATH,
                new String[]{"email"}, new String[]{getOutsiderCoach().getEmail()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getOutsiderCoach().getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void admin_sees_other_edition_coach_by_id() throws Exception {
        perform_get(getEntityPath() + "/" + getOutsiderCoach().getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getOutsiderCoach().getCallName()));
    }
}
