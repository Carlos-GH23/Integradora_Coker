package utez.edu.mx.integradora_coker.models.Bed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import utez.edu.mx.integradora_coker.models.Patient.PatientBean;
import utez.edu.mx.integradora_coker.models.floor.FloorBean;
import utez.edu.mx.integradora_coker.models.user.UserBean;

public class BedDto {
    private Long id;

    @NotBlank(message = "El identificador no puede estar vacío")
    @Size(max = 10, message = "El identificador no puede exceder 10 caracteres")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "El identificador solo puede contener letras y números")
    private String identifier;

    private boolean occupied = false;

    @NotNull(message = "El piso no puede ser nulo")
    private FloorBean floor;

    private UserBean user;

    private PatientBean patient;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public FloorBean getFloor() {
        return floor;
    }

    public void setFloor(FloorBean floor) {
        this.floor = floor;
    }

    public UserBean getUser() {
        return user;
    }

    public void setUser(UserBean user) {
        this.user = user;
    }

    public PatientBean getPatient() {
        return patient;
    }

    public void setPatient(PatientBean patient) {
        this.patient = patient;
    }

    public boolean isOccupied() {
        return occupied;
    }

    public void setOccupied(boolean occupied) {
        this.occupied = occupied;
    }

    public static BedDto fromEntity(BedBean bed) {
        BedDto dto = new BedDto();
        dto.setId(bed.getId());
        dto.setIdentifier(bed.getIdentifier());
        dto.setFloor(bed.getFloor());
        dto.setUser(bed.getUser());
        dto.setPatient(bed.getPatient());
        dto.setOccupied(bed.isOccupied());
        return dto;
    }

    public BedBean toEntity() {
        BedBean bed = new BedBean();
        bed.setId(this.id);
        bed.setIdentifier(this.identifier);
        bed.setFloor(this.floor);
        bed.setUser(this.user);
        bed.setPatient(this.patient);
        bed.setOccupied(this.occupied);
        return bed;
    }
}
