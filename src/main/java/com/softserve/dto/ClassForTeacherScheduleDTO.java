package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.softserve.entity.Lesson;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ClassForTeacherScheduleDTO {
    @JsonProperty("class")
    private PeriodDTO period;
    private List<LessonForTeacherScheduleDTO> lessons;
}