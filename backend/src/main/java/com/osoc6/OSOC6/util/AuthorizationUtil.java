package com.osoc6.OSOC6.util;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * This class helps with authorization.
 * It's methods can be used in SpEL expressions.
 */
@Component("authorizationUtil")
public final class AuthorizationUtil {
    /**
     * Constructor of class. Does nothing.
     */
    private AuthorizationUtil() { }

    /**
     * Get all the id's of all of the given user's editions.
     * @param userEntity the user to get all edition id's of
     * @return a list containing all of the user's editions
     */
    public static List<Long> userEditions(final UserEntity userEntity) {
        List<Long> result = new ArrayList<>();
        for (Invitation invitation: userEntity.getReceivedInvitations()) {
            result.add(invitation.getEdition().getId());
        }
        System.out.println(result);
        return result;
    }
}
