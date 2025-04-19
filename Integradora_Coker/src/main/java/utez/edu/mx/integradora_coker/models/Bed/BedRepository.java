package utez.edu.mx.integradora_coker.models.Bed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<BedBean, Long> {
    @Query(value = "SELECT * FROM beds WHERE user_id = :userId", nativeQuery = true)
    List<BedBean> findBedsByAssignedUser(@Param("userId") Long userId);

    @Query(value = "SELECT b FROM BedBean b WHERE b.user.id = :userId")
    List<BedBean> findByUser_Id(@Param("userId") Long userId);

    boolean existsByIdentifierAndFloorId(String identifier, Long floorId);

}
