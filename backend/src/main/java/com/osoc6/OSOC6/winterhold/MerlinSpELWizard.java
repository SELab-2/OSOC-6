package com.osoc6.OSOC6.winterhold;

/**
 * Spring Expression Language.
 */
public final class MerlinSpELWizard {
    private MerlinSpELWizard() { }

    public static final String ADMIN_AUTH = "hasAuthority('ADMIN')";

    public static final String COACH_AUTH = "hasAuthority('COACH')";
}
