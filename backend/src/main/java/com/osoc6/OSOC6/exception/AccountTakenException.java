package com.osoc6.OSOC6.exception;

import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;

/**
 * This exception is thrown when the email-address, used to register a user, has already been assigned to an account.
 */
public class AccountTakenException extends RuntimeException {
    /**
     * This custom exception is thrown when an email-address is already assigned to an account.
     * @param email the email address
     */
    public AccountTakenException(final String email) {
        super(String.format(MeguminExceptionWizard.ACCOUNT_TAKEN_EXCEPTION, email));
    }
}
