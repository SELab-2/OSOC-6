package com.osoc6.OSOC6.dto;

import javax.validation.constraints.NotBlank;

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
     *
     * @return whether or not the edition is active
     */
    public boolean isActive() {
        return active;
    }

    /**
     *
     * @return the name of the edition
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @return the year of the edition
     */
    public int getYear() {
        return year;
    }

    /**
     *
     * @param newName name of the edition
     */
    public void setName(final String newName) {
        name = newName;
    }

    /**
     *
     * @param newYear in which the edition was held
     */
    public void setYear(final int newYear) {
        year = newYear;
    }

    /**
     *
     * @param newActive whether the edition is currently active
     */
    public void setActive(final boolean newActive) {
        active = newActive;
    }
}
