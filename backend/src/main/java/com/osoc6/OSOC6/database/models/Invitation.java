package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.crypto.keygen.Base64StringKeyGenerator;

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

/**
 * The database entity for an Invitation.
 * An Invitation is sent by admins to coaches and allows them to activate their account for the {@link Edition}
 * this Invitation was made for.
 */
@Entity
@NoArgsConstructor
public class Invitation {
    /**
     * The id of the invitation.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The unique token of the invitation.
     */
    @Basic(optional = false)
    @Column(unique = true, updatable = false)
    @Getter
    private final String token = new Base64StringKeyGenerator().generateKey();

    /**
     * The timestamp of the invitation.
     */
    @Basic(optional = false)
    @CreationTimestamp @Column(updatable = false)
    @Getter
    private Timestamp creationTimestamp;

    /**
     * {@link Edition} for which this invitation was created.
     */
    @ManyToOne(optional = false)
    @Getter @Setter
    private Edition edition;

    /**
     * User that issued the invitation.
     */
    @ManyToOne(optional = false)
    @Getter @Setter
    private UserEntity issuer;

    /**
     * User that accepted the invitation.
     */
    @ManyToOne(optional = true)
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    @Getter @Setter
    private UserEntity subject;

    /**
     *
     * @param newEdition the edition of the invitation
     * @param newIssuer user that issued the invitation
     * @param newSubject user that accepted the invitation
     */
    public Invitation(final Edition newEdition, final UserEntity newIssuer, final UserEntity newSubject) {
        super();
        edition = newEdition;
        issuer = newIssuer;
        subject = newSubject;
    }

    /**
     *
     * @return Whether the invitation has been used
     */
    public boolean isUsed() {
        return subject != null;
    }

    /**
     * @return Whether the invitation is still valid. An invitation is valid for a limited time.
     */
    public boolean isValid() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(creationTimestamp);
        cal.add(Calendar.DAY_OF_WEEK, RadagastNumberWizard.INVITATION_EXPIRATION_DAYS);
        return !isUsed() && cal.getTime().toInstant().isBefore(Instant.now());
    }
}
