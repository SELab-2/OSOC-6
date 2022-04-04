package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * This is a simple class that defines a repository for {@link Student},
 * this is needed for the database.
 * Coaches don't get access to this resource since they are unable to track communication from within the tool.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.STUDENT_PATH,
        path = DumbledorePathWizard.STUDENT_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface StudentRepository extends JpaRepository<Student, Long> {
    @RestResource(path = "nameStartsWith", rel = "nameStartsWith")
    @Query("select s from Student s where s.callName like concat(:callName, '%') and s.edition.name = :edition")
    Page<Student> findByName(
            @Param("callName") String callName, @Param("edition") String editionName, Pageable pageable);

    @RestResource(path = "findByEmail", rel = "findByEmail")
    @Query("select s from Student s where s.email LIKE :email and s.edition = :edition")
    Page<Student> findByEmail(
            @Param("email") String email, @Param("edition") String editionName, Pageable pageable);

    // Do something like: PreAutherize(@allEditions(precistence).contains(#edition)) to optimize query
    // To implement this we need a function class
    // @Query("select s from Student s where s.edition = :edition and s.osocExperience = :#{}")
    // Page<Student> potentialCoach(@Param("edition") String editionName, Pageable pageable);

    // Needs a findBy free text.
}
