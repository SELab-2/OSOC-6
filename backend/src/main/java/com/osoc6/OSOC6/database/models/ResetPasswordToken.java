package com.osoc6.OSOC6.database.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Calendar;
import java.util.UUID;

/**
 * The database entity for a ResetPasswordToken.
 * A reset password token is used to allow users to reset their password when they have forgotten it.
 */
@Entity
@NoArgsConstructor
public class ResetPasswordToken {

    /**
     * The id of the reset password token.
     */
    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The unique token.
     * We cannot use the Base64StringKeyGenerator here because it can contain special html characters.
     */
    @Basic(optional = false)
    @Column(unique = true) @ReadOnlyProperty
    @Getter
    private final String token = UUID.randomUUID().toString();

    /**
     * The creation timestamp.
     */
    @Basic(optional = false)
    @CreationTimestamp
    @ReadOnlyProperty
    @Getter
    private Timestamp creationTimestamp;

    /**
     * User that requested the password reset.
     */
    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    @Getter @Setter
    private UserEntity subject;

    /**
     *
     * @param newSubject user that requested the password reset
     */
    public ResetPasswordToken(final UserEntity newSubject) {
        subject = newSubject;
    }

    /**
     * @return Whether the reset password token is still valid. A token is only valid for a limited time.
     */
    @JsonIgnore
    public boolean isValid() {
        // TODO cronjob toevoegen aan server die verlopen reset password tokens verwijdert
        Calendar cal = Calendar.getInstance();
        cal.setTime(creationTimestamp);
        cal.add(Calendar.HOUR_OF_DAY, RadagastNumberWizard.PASSWORD_TOKEN_EXPIRATION_HOURS);
        return Instant.now().getEpochSecond()
                <= cal.getTimeInMillis() / RadagastNumberWizard.MILLISECOND_IN_SECOND;
    }
}
