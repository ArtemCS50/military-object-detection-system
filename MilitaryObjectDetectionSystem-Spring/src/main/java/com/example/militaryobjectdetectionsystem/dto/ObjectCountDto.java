package com.example.militaryobjectdetectionsystem.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ObjectCountDto {
    private String email;
//    private Long videoId;
    private Map<String, Integer> counts;
}
