package com.osoc6.OSOC6.winterhold;

/**
 * Merlin is a SpELL (Spring Expression Language) Wizard.
 * He will help us write concise and manageable Spring expressions.
 * Variables starting with 'Q_' are meant to be used in Query annotations of spring.
 */
public final class MerlinSpELWizard {
    private MerlinSpELWizard() { }

    /**
     * Check is the current user has the admin authority.
     */
    public static final String ADMIN_AUTH = "hasAuthority('ADMIN')";

    /**
     * Check is the current user has the admin authority. (Query notation)
     */
    public static final String Q_ADMIN_AUTH = ":#{hasAuthority('ADMIN')} = true";

    /**
     * Check is the current user has the coach authority.
     */
    public static final String COACH_AUTH = "hasAuthority('COACH')";

    /**
     * Provides a Query notated view of the id's the current user has access to. (Query notation)
     */
    public static final String Q_USER_EDITIONS = ":#{@authorizationUtil.userEditions(authentication.principal)}";
}
