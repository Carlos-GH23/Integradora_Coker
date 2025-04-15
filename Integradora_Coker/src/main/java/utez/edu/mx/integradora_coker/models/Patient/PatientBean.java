package utez.edu.mx.integradora_coker.models.Patient;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.integradora_coker.models.Bed.BedBean;

@Entity
@Table(name ="patient")

public class PatientBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;

    @OneToOne
    @JoinColumn(name = "bed_id")
    @JsonIgnore
    private BedBean bed;

    public PatientBean(Long id, BedBean bed, String fullName) {
        this.id = id;
        this.bed = bed;
        this.fullName = fullName;
    }

    public PatientBean() {
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public BedBean getBed() {
        return bed;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setBed(BedBean bed) {
        this.bed = bed;
    }
}