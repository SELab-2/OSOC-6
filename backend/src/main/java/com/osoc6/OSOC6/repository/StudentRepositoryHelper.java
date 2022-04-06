package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.Student;
import org.springframework.stereotype.Component;

@Component("studentRepoHelp")
public final class StudentRepositoryHelper {
    private StudentRepositoryHelper() { }

    public OsocExperience COACH_EXPERIENCE = OsocExperience.YES_STUDENT_COACH;

    public boolean matchesInSomeField(Student student) {
        return true;
    }
}
