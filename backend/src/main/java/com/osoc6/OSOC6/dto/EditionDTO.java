package com.osoc6.OSOC6.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

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
}
