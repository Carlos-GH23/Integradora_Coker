package utez.edu.mx.integradora_coker.models.Patient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import utez.edu.mx.integradora_coker.models.Bed.BedBean;

public class PatientDto {
    private Long id;

    @NotBlank(message = "El nombre completo no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Pattern(
            regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
            message = "El nombre solo puede contener letras y espacios"
    )
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

    public static PatientDto fromEntity(PatientBean patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setFullName(patient.getFullName());
        dto.setBed(patient.getBed());
        return dto;
    }

    public PatientBean toEntity() {
        PatientBean patient = new PatientBean();
        patient.setId(this.id);
        patient.setFullName(this.fullName);
        patient.setBed(this.bed);
        return patient;
    }
}
