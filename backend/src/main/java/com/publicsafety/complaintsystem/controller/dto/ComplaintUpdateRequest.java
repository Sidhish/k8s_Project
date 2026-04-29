package com.publicsafety.complaintsystem.controller.dto;

import com.publicsafety.complaintsystem.domain.Status;

public class ComplaintUpdateRequest {
    private Status status;
    private String remarks;

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
