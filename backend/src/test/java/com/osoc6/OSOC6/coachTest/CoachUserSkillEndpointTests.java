package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.database.models.UserSkill;
import com.osoc6.OSOC6.dto.UserSkillDTO;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.repository.UserSkillRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link UserSkill} as a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachUserSkillEndpointTests extends TestFunctionProvider<UserSkill, Long, UserSkillRepository> {

    /**
     * The UserSkillRepository that saves, searches, ... in the database
     */
    @Autowired
    private UserSkillRepository userSkillRepository;

    /**
     * The UserRepository that saves, searches, ... in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * The InvitationRepository that saves, searches, ... in the database
     */
    @Autowired
    private InvitationRepository invitationRepository;

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Sample UserSkill of admin that gets loaded before every test.
     */
    private final UserSkill adminSkill = new UserSkill("Active like Duracel bunny", getAdminUser(),
            "The admin is very active");

    /**
     * Sample UserSkill that gets loaded before every test.
     */
    private final UserSkill coachSkill = new UserSkill("Coaching with passion", getCoachUser(),
            "I just want my students to learn");

    /**
     * Sample UserSkill of outsider user that gets loaded before every test.
     */
    private final UserSkill outsiderSkill = new UserSkill("Lonely loner", getOutsiderCoach(),
            "Stands outside in the rain and cries.");

    /**
     * Email of matching edition coach to be used in annotations.
     */
    private static final String MATCHING_EDITION_COACH_EMAIL = "matching@user.com";

    /**
     * Sample User with a matching edition to base Coach that gets loaded before every test.
     */
    private final UserEntity matchingEditionCoach = new UserEntity(MATCHING_EDITION_COACH_EMAIL, "Match User",
            UserRole.COACH, "abc");

    /**
     * Invitation that makes matchingEditionCoach registered to the same edition as the base coach.
     */
    private final Invitation matchingEditionUserInvitation = new Invitation(getBaseUserEdition(), getAdminUser(),
            matchingEditionCoach);

    /**
     * The actual path users are served on, with '/' as prefix.
     */
    private static final String USER_SKILL_PATH = "/" + DumbledorePathWizard.USER_SKILL_PATH;

    /**
     * The string that will be set on a POST or PATCH and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Smart as an owl and a dolphin combined";

    public CoachUserSkillEndpointTests() {
        super(USER_SKILL_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(final UserSkill entity) {
        return entity.getId();
    }

    @Override
    public UserSkillRepository get_repository() {
        return userSkillRepository;
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        userRepository.save(matchingEditionCoach);
        invitationRepository.save(matchingEditionUserInvitation);

        userSkillRepository.save(adminSkill);
        userSkillRepository.save(outsiderSkill);
        userSkillRepository.save(coachSkill);
    }

    @Override
    public void removeSetUpRepository() {
        userSkillRepository.deleteAll();

        invitationRepository.deleteAll();
        userRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public UserSkill create_entity() {
        return new UserSkill(TEST_STRING, getCoachUser(), "");
    }

    @Override
    public Map<String, String> change_entity(final UserSkill startEntity) {
        return Map.of("name", TEST_STRING);
    }

    @Override
    public String transform_to_json(final UserSkill entity) {
        UserSkillDTO skillDTO = new UserSkillDTO(entity, entityLinks);
        return Util.asJsonString(skillDTO);
    }

    // ============================= Start Tests =============================

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_is_forbidden() throws Exception {
        perform_get(getEntityPath()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void user_post_own_skill_works() throws Exception {
        perform_post(getEntityPath(), create_entity())
                .andExpect(status().isCreated())
                .andExpect(string_to_contains_string(TEST_STRING));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void user_post_others_skill_forbidden() throws Exception {
        perform_post(getEntityPath(), create_entity())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void user_post_invalid_skill_forbidden() throws Exception {
        UserSkill skill = new UserSkill("An invalid skill", null, "Why invalid? No coach!");
        perform_post(getEntityPath(), skill)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void user_patch_own_skill_works() throws Exception {
        perform_patch(getEntityPath() + "/" + coachSkill.getId(), Map.of("name", "Imposter syndrome"))
                .andExpect(status().isOk()).andExpect(string_to_contains_string("Imposter syndrome"));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void user_patch_others_skill_forbidden() throws Exception {
        perform_patch(getEntityPath() + "/" + coachSkill.getId(), Map.of("name", "Imposter syndrome"))
                .andExpect(status().isOk()).andExpect(string_to_contains_string("Imposter syndrome"));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_own_userSkill_by_id_works() throws Exception {
        perform_get(getEntityPath() + "/" + coachSkill.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(coachSkill.getName()));
    }

    @Test
    @WithUserDetails(value = MATCHING_EDITION_COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_userSkill_by_id_of_matching_edition_user_works() throws Exception {
        perform_get(getEntityPath() + "/" + coachSkill.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(coachSkill.getName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_userSkill_by_id_of_admin_works() throws Exception {
        perform_get(getEntityPath() + "/" + adminSkill.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(adminSkill.getName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_userSkill_by_id_of_other_edition_user_fails() throws Exception {
        perform_get(getEntityPath() + "/" + coachSkill.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_own_userSkill_works() throws Exception {
        perform_delete_with_id(getEntityPath(), coachSkill.getId()).andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_others_userSkill_fails() throws Exception {
        perform_delete_with_id(getEntityPath(), adminSkill.getId()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails() throws Exception {
        base_getting_illegal_entity_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_id_fails() throws Exception {
        base_patching_entity_to_illegal_id_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }

}