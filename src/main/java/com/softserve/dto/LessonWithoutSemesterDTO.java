package com.softserve.dto;

import com.softserve.entity.enums.LessonType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class LessonWithoutSemesterDTO {
    private Long id;
    private int hours;
    private String teacherForSite;
    private String subjectForSite;
    private LessonType lessonType;
    private SubjectDTO subject;
    private GroupDTO group;
    private TeacherDTO teacher;
    private boolean grouped;
}