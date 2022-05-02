package com.osoc6.OSOC6.winterhold;

/**
 * Merlin is a SpEL (Spring Expression Language) Wizard.
 * He will help us write concise and manageable Spring expressions.
 * Variables starting with 'Q_' are meant to be used in Query annotations of spring.
 */
public final class MerlinSpELWizard {
    private MerlinSpELWizard() { }

    /**
     * Get the id of the logged-in user in a query. (Query notation)
     */
    public static final String Q_USER_ID = ":#{authentication.principal.id}";

    /**
     * Check if the current user has the admin authority.
     */
    public static final String ADMIN_AUTH = "hasAuthority('ADMIN')";

    /**
     * Check if the current user has the admin authority. (Query notation)
     */
    public static final String Q_ADMIN_AUTH = ":#{hasAuthority('ADMIN')} = true";

    /**
     * Check if the current user has the coach authority.
     */
    public static final String COACH_AUTH = "hasAuthority('COACH')";

    /**
     * Provides a Query notated view of the id's the current user has access to. (Query notation)
     */
    public static final String Q_USER_EDITIONS = ":#{@spelUtil.userEditions(authentication.principal)}";

    /**
     * SpEl expression checking that a non admin user has access to the optional returnObject.
     */
    public static final String USER_HAS_ACCESS_ON_OPTIONAL = "!returnObject.present or "
        + "@spelUtil.userEditions(authentication.principal).contains(returnObject.get.controllingEdition.id)";


    /**
     * SpEL expression checking if the authorized user can query over a certain edition.
     */
    public static final String USER_CAN_QUERY_EDITION = ADMIN_AUTH
            + " or @spelUtil.userEditions(authentication.principal).contains(#edition)";
}
