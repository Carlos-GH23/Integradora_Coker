package utez.edu.mx.integradora_coker.models.Role;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleBean, Long> {
    Optional<RoleBean> findByName(String name);
}