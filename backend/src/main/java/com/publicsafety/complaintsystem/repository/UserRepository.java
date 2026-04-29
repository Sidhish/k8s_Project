package com.publicsafety.complaintsystem.repository;

import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRoleIn(List<Role> roles);
    List<User> findByRole(Role role);
}
