package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * This is a simple class that defines a repository for SkillType, this is needed for the database.
 *
 * @author jitsedesmet
 */
public interface SkillTypeRepository extends JpaRepository<SkillType, String> {  }
