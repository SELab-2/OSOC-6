package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.Skill;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Set;

public class UserProfileDTO {

    /**
     * The email of a user.
     */
    @NotBlank(message = "{email.notempty}")
    @Email(message = "{email.valid}")
    private String email;

    /**
     * The first name of a user.
     */
    @NotBlank(message = "{firstname.notempty}")
    private String firstName;

    /**
     * The last name of the user.
     */
    @NotBlank(message = "{lastname.notempty}")
    private String lastName;

    /**
     * Set of skills a user has.
     */
    private Set<Skill> skills;

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @return the first name
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * @return the last name
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * @return the skills
     */
    public Set<Skill> getSkills() {
        return skills;
    }

    /**
     * @param newEmail the new email
     */
    public void setEmail(final String newEmail) {
        email = newEmail;
    }

    /**
     * @param newFirstName the new first name
     */
    public void setFirstName(final String newFirstName) {
        firstName = newFirstName;
    }

    /**
     * @param newLastName the new last name
     */
    public void setLastName(final String newLastName) {
        lastName = newLastName;
    }
}
