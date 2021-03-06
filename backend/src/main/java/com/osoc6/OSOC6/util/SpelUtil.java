package com.osoc6.OSOC6.util;

import com.osoc6.OSOC6.entities.Invitation;
import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.entities.UserRole;
import lombok.Getter;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * This class helps with authorization.
 * It's methods can be used in SpEL expressions.
 */
@Component("spelUtil")
public final class SpelUtil {
    /**
     * Constructor of class. Does nothing.
     */
    private SpelUtil() { }

    /**
     * This field is populated by Spring upon startup with the secret webhook token from the properties file.
     */
    @Getter
    @Value("${webhook.token}")
    private String webhookToken;

    /**
     * Get all the id's of all of the given users editions as an array List.
     * This is private since we don't want to export List implementation dependencies.
     * @param userEntity the user to get all edition id's of
     * @return a list containing all of the users editions
     */
    private static ArrayList<Long> userEditionsArrayList(final UserEntity userEntity) {
        ArrayList<Long> result = new ArrayList<>();
        for (Invitation invitation: userEntity.getReceivedInvitations()) {
            if (invitation.getControllingEdition().getActive()) {
                result.add(invitation.getControllingEdition().getId());
            }
        }
        return result;
    }

    /**
     * Get all the id's of all of the given users editions.
     * @param userEntity the user to get all edition id's of
     * @return a list containing all of the users editions
     */
    public static List<Long> userEditions(final UserEntity userEntity) {
        return userEditionsArrayList(userEntity);
    }

    /**
     * Checks if 2 users can see eachother.
     * @param first the first {@link UserEntity} that needs to be checked.
     * @param second the second {@link UserEntity} that needs to be checked.
     * @return whether the provided user can see each other
     */
    public static Boolean hasOverlappingEditions(final UserEntity first, final UserEntity second) {
        if (first.getUserRole() == UserRole.ADMIN || second.getUserRole() == UserRole.ADMIN) {
            return true;
        }
        return userEditionsArrayList(first).stream().anyMatch(userEditionsArrayList(second)::contains);
    }

    /**
     * Get a formatted query string substituting spaces with '&'.
     * @param ownFormat a string that uses space separation for different string
     * @return a safe text search query string
     */
    public static String safeToTSQuery(final String ownFormat) {
        return safeString(ownFormat).strip().replaceAll(" +", " & ");
    }

    /**
     * Get a non-null representation of a string array. Defaults to empty array.
     * @param strArray string array that should have null safety
     * @return a non-null array.
     */
    public static String[] safeArray(final String[] strArray) {
        if (strArray == null) {
            return new String[]{};
        }
        return strArray;
    }

    /**
     * Get a non-null representation of a string. Defaults to empty string.
     * @param orig String that should have NULL safety
     * @return a non null String
     */
    @NonNull
    public static String safeString(final String orig) {
        return orig == null ? "" : orig;
    }

    /**
     * Get a non-null representation of a Long. Defaults to 0L.
     * @param orig Long that should have NULL safety
     * @return a non null Long
     */
    @NonNull
    public static Long safeLong(final Long orig) {
        return orig == null ? 0L : orig;
    }

    /**
     * Get a non-null representation of a Boolean. Defaults to false.
     * @param orig Boolean that should have NULL safety
     * @return a non null Boolean
     */
    @NonNull
    public static Boolean safeBoolean(final Boolean orig) {
        // return orig == null ? false : orig;
        return orig != null && orig;
    }
}
