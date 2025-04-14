package utez.edu.mx.integradora_coker.models.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import utez.edu.mx.integradora_coker.models.Bed.BedBean;
import utez.edu.mx.integradora_coker.models.Role.RoleBean;
import utez.edu.mx.integradora_coker.models.floor.FloorBean;


import java.util.Set;

@Entity
@Table(name ="user")

public class UserBean{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    @Column(name = "username", nullable = false)
    private String username;

    private String password;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    @JsonIgnore
    private FloorBean floor;

    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonIgnore
    private RoleBean role;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private Set<BedBean> beds;

    public UserBean(Long id, String fullName, String email, String phoneNumber, String username, String password, FloorBean floor, RoleBean role, Set<BedBean> beds) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.password = password;
        this.floor = floor;
        this.role = role;
        this.beds = beds;
    }

    public UserBean() {
    }


    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public FloorBean getFloor() {
        return floor;
    }


    public Set<BedBean> getBeds() {
        return beds;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFloor(FloorBean floor) {
        this.floor = floor;
    }

    public void setBeds(Set<BedBean> beds) {
        this.beds = beds;
    }

    public RoleBean getRole() {
        return role;
    }

    public void setRole(RoleBean role) {
        this.role = role;
    }
}
