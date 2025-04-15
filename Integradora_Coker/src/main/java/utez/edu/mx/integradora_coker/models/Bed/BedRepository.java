package utez.edu.mx.integradora_coker.models.Bed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BedRepository extends JpaRepository<BedBean, Long> {
}
