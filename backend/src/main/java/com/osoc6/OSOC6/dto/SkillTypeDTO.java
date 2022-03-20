package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.SkillType;
import lombok.Data;
import lombok.NonNull;

import javax.validation.constraints.NotBlank;

/**
 * Data transfer Object for a {@link SkillType}.
 */
@Data
public class SkillTypeDTO {
    /**
     * The type of skill.
     */
    @NotBlank(message = "A SkillType must have a name")
    private String name;

    /**
     * The colour associated with this SkillType.
     */
    @NotBlank(message = "A colour must have a colour")
    private String colour;

    /**
     * Takes a skillType entity and return it's DTO.
     * @param skillType the skillType entity that needs to be transformed
     * @return DTO representation of the entity
     */
    public static @NonNull SkillTypeDTO fromEntity(@NonNull final SkillType skillType) {
        SkillTypeDTO dto = new SkillTypeDTO();
        dto.setName(skillType.getName());
        dto.setColour(skillType.getColour());
        return dto;
    }
}
