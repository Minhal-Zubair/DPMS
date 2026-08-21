package com.dpms.dpmsbackend.repository;
import com.dpms.dpmsbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User,Long>{
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByCnic(String cnic);
    boolean existsByUsername(String username);
    Optional<User> findByEmail(String email);
    long countByEnabled(Boolean enabled);
    long countByAccountLocked(Boolean locked);
    long countByEnabledTrue();
    long countByEnabledFalse();
    long countByAccountLockedTrue();
}