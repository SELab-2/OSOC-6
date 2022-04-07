package com.osoc6.OSOC6.database.models.student;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.WeakToEdition;
import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * The database entity for a skill of a {@link Student}.
 * A StudentSkill is a Skill specific for students. It has a certain type,
 * {@link com.osoc6.OSOC6.database.models.SkillType}.
 */
@Entity
@NoArgsConstructor
public final class StudentSkill implements WeakToEdition {
    /**
     * The id of the skill.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The name of the skill.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String name;

    /**
     * The student that owns this skill.
     */
    @ManyToOne(optional = false)
    @ReadOnlyProperty
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;

    /**
     *
     * @param newName the name of the skill
     * @param newStudent the student that owns this skill.
     */
    public StudentSkill(final String newName, final Student newStudent) {
        super();
        name = newName;
        student = newStudent;
    }

    @Override
    public Edition getControllingEdition() {
        return student.getControllingEdition();
    }
}
