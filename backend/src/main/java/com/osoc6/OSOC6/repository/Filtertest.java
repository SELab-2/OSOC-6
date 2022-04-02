package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Organisation;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component("myFilterTest")
public class Filtertest {
    public boolean testField(final Page<Organisation> organisation) {
        return organisation.hasContent();
    }
}
