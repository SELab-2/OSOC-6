package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
