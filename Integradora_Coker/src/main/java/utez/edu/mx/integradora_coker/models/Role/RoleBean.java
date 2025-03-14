package utez.edu.mx.integradora_coker.models.Role;

import jakarta.persistence.*;
import utez.edu.mx.integradora_coker.models.user.UserBean;


import java.util.Set;

@Entity
@Table(name ="rol")
public class RoleBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "role")
    private Set<UserBean> users;

    public RoleBean(Long id, String name, Set<UserBean> users) {
        this.id = id;
        this.name = name;
        this.users = users;
    }
    public RoleBean() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<UserBean> getUsers() {
        return users;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsers(Set<UserBean> users) {
        this.users = users;
    }
}
