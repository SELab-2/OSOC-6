package com.osoc6.OSOC6.entities.student;

/**
 * This enum contains the different status a student can have.
 * A status is mainly used in the mailing module to track which type of email a student has received.
 */
public enum Status {
    /**
     * Student is still being screened, no decision has been made.
     */
    UNDECIDED,
    /**
     * A maybe email was sent to the student.
     */
    MAYBE,
    /**
     * A rejection email has been stent to the student.
     */
    REJECTED,
    /**
     * An approval email was sent to the student.
     */
    APPROVED,
    /**
     * The student was approved and has signed the contract.
     */
    CONTRACT_CONFIRMED,
    /**
     * The student no longer wishes to participate and/or has denied their contract.
     */
    CONTRACT_DECLINED,
}
