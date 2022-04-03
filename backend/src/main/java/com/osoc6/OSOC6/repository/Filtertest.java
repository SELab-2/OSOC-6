package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("myFilterTest")
public class Filtertest {
    public List<Long> userEditions(final UserEntity entity) {
        List<Long> result = new ArrayList<>();
        for (Invitation invitation: entity.getReceivedInvitations()) {
            result.add(invitation.getEdition().getId());
        }
        return result;
    }

    public boolean hasFullAccess(final UserEntity entity) {
        return entity.getUserRole() == UserRole.ADMIN;
    }
}
