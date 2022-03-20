package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.Edition;
import lombok.Data;
import lombok.NonNull;

import javax.validation.constraints.NotBlank;

/**
 * Data transfer Object for an {@link Edition}.
 */
@Data
public class EditionDTO {
    /**
     * The name of the edition.
     */
    @NotBlank(message = "An edition must have a name")
    private String name;

    /**
     * The year of the edition.
     */
    private int year;

    /**
     * Whether the edition is active.
     */
    private boolean active;

    /**
     * Takes an edition entity and return it's DTO.
     * @param edition the edition entity that needs to be transformed
     * @return DTO representation of the entity
     */
    public static @NonNull EditionDTO fromEntity(@NonNull final Edition edition) {
        EditionDTO dto = new EditionDTO();
        dto.setName(edition.getName());
        dto.setYear(edition.getYear());
        dto.setActive(edition.isActive());
        return dto;
    }
}
