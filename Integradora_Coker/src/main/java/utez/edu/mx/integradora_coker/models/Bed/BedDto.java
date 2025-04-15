package utez.edu.mx.integradora_coker.models.Bed;


import utez.edu.mx.integradora_coker.models.Patient.PatientBean;
import utez.edu.mx.integradora_coker.models.floor.FloorBean;
import utez.edu.mx.integradora_coker.models.user.UserBean;

public class BedDto {
    private Long id;
    private String identifier;
    private FloorBean floor;
    private UserBean user;
    private PatientBean patient;

    // Getters and Setters
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

    // Convert from BedBean to BedDto
    public static BedDto fromEntity(BedBean bed) {
        BedDto dto = new BedDto();
        dto.setId(bed.getId());
        dto.setIdentifier(bed.getIdentifier());
        dto.setFloor(bed.getFloor());
        dto.setUser(bed.getUser());
        dto.setPatient(bed.getPatient());
        return dto;
    }

    // Convert from BedDto to BedBean
    public BedBean toEntity() {
        BedBean bed = new BedBean();
        bed.setId(this.id);
        bed.setIdentifier(this.identifier);
        bed.setFloor(this.floor);
        bed.setUser(this.user);
        bed.setPatient(this.patient);
        return bed;
    }
}