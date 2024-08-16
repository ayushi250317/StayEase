package com.example.server.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AddPropertyResponse {
    private String message;
    private Boolean success;
    private Integer property_id;
}
