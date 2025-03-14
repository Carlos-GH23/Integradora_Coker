package utez.edu.mx.integradora_coker.models.floor;

import jakarta.persistence.*;
import utez.edu.mx.integradora_coker.models.Bed.BedBean;
import utez.edu.mx.integradora_coker.models.user.UserBean;


import java.util.Set;

@Entity
@Table(name ="floor")

public class FloorBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String identifier;

    @OneToMany(mappedBy = "floor")
    private Set<UserBean> users;

    @OneToMany(mappedBy = "floor")
    private Set<BedBean> beds;

    public FloorBean(Long id, String identifier, Set<UserBean> users, Set<BedBean> beds) {
        this.id = id;
        this.identifier = identifier;
        this.users = users;
        this.beds = beds;
    }

    public FloorBean() {
    }

    public Long getId() {
        return id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public Set<UserBean> getUsers() {
        return users;
    }

    public Set<BedBean> getBeds() {
        return beds;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setUsers(Set<UserBean> users) {
        this.users = users;
    }

    public void setBeds(Set<BedBean> beds) {
        this.beds = beds;
    }
}
