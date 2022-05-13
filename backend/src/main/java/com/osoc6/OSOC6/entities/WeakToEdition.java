package com.osoc6.OSOC6.entities;

/**
 * This interface expresses weakness to edition and allows us to find the edition an instance is weak to.
 */
public interface WeakToEdition {
    /**
     * Get the edition this instance is weak to.
     * @return edition this instance is weak to.
     */
    Edition getControllingEdition();
}
