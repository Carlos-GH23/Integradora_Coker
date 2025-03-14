package utez.edu.mx.integradora_coker.models.Patient;


import utez.edu.mx.integradora_coker.models.Bed.BedBean;

public class PatientDto {
    private Long id;
    private String fullName;
    private BedBean bed;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public BedBean getBed() {
        return bed;
    }

    public void setBed(BedBean bed) {
        this.bed = bed;
    }

    // Convert from PatientBean to PatientDto
    public static PatientDto fromEntity(PatientBean patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setFullName(patient.getFullName());
        dto.setBed(patient.getBed());
        return dto;
    }

    // Convert from PatientDto to PatientBean
    public PatientBean toEntity() {
        PatientBean patient = new PatientBean();
        patient.setId(this.id);
        patient.setFullName(this.fullName);
        patient.setBed(this.bed);
        return patient;
    }
}