package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserSkill;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

/**
 * A DTO that helps to convert a UserSkill to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public final class UserSkillDTO {
    /**
     * The id of the skill.
     */
    private Long id;

    /**
     * The name of the skill.
     */
    private String name;

    /**
     * The description of the skill.
     */
    private String additionalInfo;

    /**
     * The Project that looks for this skill.
     */
    private String userEntity;

    public UserSkillDTO(final UserSkill skill, final EntityLinks entityLinks) {
        id = skill.getId();
        name = skill.getName();
        additionalInfo = skill.getAdditionalInfo();

        userEntity = skill.getUserEntity() == null ? null
            : entityLinks.linkToItemResource(UserEntity.class, skill.getUserEntity().getId().toString()).getHref();
    }
}
