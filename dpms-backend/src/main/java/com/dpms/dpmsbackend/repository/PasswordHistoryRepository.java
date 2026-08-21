package com.dpms.dpmsbackend.repository;

import com.dpms.dpmsbackend.entity.PasswordHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordHistoryRepository
        extends JpaRepository<PasswordHistory, Long> {

}