package utez.edu.mx.integradora_coker.models.Patient;

public class PatientAssignmentDto {
    private Long bedId;
    private Long patientId;

    public Long getBedId() {
        return bedId;
    }

    public void setBedId(Long bedId) {
        this.bedId = bedId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void getPatientId(Long userId) {
        this.patientId = userId;
    }
}
