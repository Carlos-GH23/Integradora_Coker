package utez.edu.mx.integradora_coker.models.Bed;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.integradora_coker.models.Patient.PatientBean;
import utez.edu.mx.integradora_coker.models.floor.FloorBean;
import utez.edu.mx.integradora_coker.models.user.UserBean;


@Entity
@Table(name ="beds")

public class BedBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String identifier;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    @JsonIgnore
    private FloorBean floor;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserBean user;

    @OneToOne(mappedBy = "bed")
    @JsonIgnore
    private PatientBean patient;

    public void setPatient(PatientBean patient) {
        this.patient = patient;
    }

    public void setUser(UserBean user) {
        this.user = user;
    }

    public void setFloor(FloorBean floor) {
        this.floor = floor;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BedBean() {
    }

    public BedBean(Long id, PatientBean patient, UserBean user, FloorBean floor, String identifier) {
        this.id = id;
        this.patient = patient;
        this.user = user;
        this.floor = floor;
        this.identifier = identifier;
    }

    public Long getId() {
        return id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public FloorBean getFloor() {
        return floor;
    }

    public UserBean getUser() {
        return user;
    }

    public PatientBean getPatient() {
        return patient;
    }
}