package com.osoc6.OSOC6.util;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import lombok.NonNull;
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
     * Get all the id's of all of the given user's editions.
     * @param userEntity the user to get all edition id's of
     * @return a list containing all of the user's editions
     */
    public static List<Long> userEditions(final UserEntity userEntity) {
        List<Long> result = new ArrayList<>();
        for (Invitation invitation: userEntity.getReceivedInvitations()) {
            if (invitation.getControllingEdition().getActive()) {
                result.add(invitation.getControllingEdition().getId());
            }
        }
        return result;
    }

    /**
     * Get a formatted string so LIKE will check if the parameter is contained.
     * @param orig ths String parameter for a query that should be formatted
     * @return the formatted string so LIKE will check if the parameter is contained
     */
    public static String formatContains(final String orig) {
        if (orig == null) {
            return "";
        }
        return "%" + orig + "%";
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
     * Get the Null safe ordinal representation of provided Enum, defaults to -1.
     * @param orig Enum that should have NULL safety
     * @param <T> type of enum (is ignored)
     * @return null safe ordinal representation of Enum
     */
    public static <T extends Enum<T>> int safeEnum(final Enum<T> orig) {
        return orig == null ? -1 : orig.ordinal();
    }
}
