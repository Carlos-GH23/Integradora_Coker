package utez.edu.mx.integradora_coker.models.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserBean, Long> {
    @Query(value = "SELECT * FROM user WHERE username = :username AND password = :password", nativeQuery = true)
    Optional<UserBean> findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

    @Query(value = "SELECT * FROM user WHERE username = :username", nativeQuery = true)
    Optional<UserBean> findByUsername(@Param("username") String username);

    @Query(value = "SELECT * FROM user WHERE role_id = :role_id", nativeQuery = true)
    List<UserBean> findByRoleId(@Param("role_id") int roleId);
}