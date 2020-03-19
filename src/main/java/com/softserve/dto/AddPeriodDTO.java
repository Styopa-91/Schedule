package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class AddPeriodDTO {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm", timezone = "GMT+3")
    private Timestamp startTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm", timezone = "GMT+3")
    private Timestamp endTime;
    private String name;
}