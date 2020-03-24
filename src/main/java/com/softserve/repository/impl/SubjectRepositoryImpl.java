package com.softserve.repository.impl;

import com.softserve.entity.Subject;
import com.softserve.repository.SubjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class SubjectRepositoryImpl extends BasicRepositoryImpl<Subject, Long> implements SubjectRepository {


    /**
     * Method gets information about all subjects from DB
     * @return List of all subjects with ASCII sorting by name
     */
    @Override
    public List<Subject> getAll() {
        log.info("Enter into getAll method of {}", getClass().getName());
        return sessionFactory.getCurrentSession()
                .createQuery("from Subject ORDER BY name ASC")
                .getResultList();
    }
}