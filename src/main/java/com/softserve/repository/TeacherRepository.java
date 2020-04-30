package com.softserve.repository;

import com.softserve.entity.Teacher;
import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends BasicRepository<Teacher, Long> {
    List<Teacher> getDisabled();
    Optional<Teacher> findByUserId(int userId);
}
