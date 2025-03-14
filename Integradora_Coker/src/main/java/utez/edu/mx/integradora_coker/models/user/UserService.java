package utez.edu.mx.integradora_coker.models.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.integradora_coker.kernel.CustomResponse;
import utez.edu.mx.integradora_coker.models.Role.RoleBean;
import utez.edu.mx.integradora_coker.models.Role.RoleRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomResponse customResponse;

    // Obtener todos los usuarios
    public ResponseEntity<?> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(users);
    }

    public ResponseEntity<?> getUserById(Long id) {
        Optional<UserBean> user = userRepository.findById(id);
        if (user.isPresent()) {
            return customResponse.getOkResponse(toDTO(user.get()));
        } else {
            return customResponse.get400Response(404);
        }
    }

    @Transactional
    public ResponseEntity<?> createUserWithRole(UserDto userDto, String roleName) {
        Set<String> allowedRoles = Set.of( "SECRETARY", "NURSE");

        String normalizedRoleName = roleName.toUpperCase();

        if (!allowedRoles.contains(normalizedRoleName)) {
            return customResponse.get400Response(400);
        }

        // Buscar el rol en la base de datos
        Optional<RoleBean> roleOpt = roleRepository.findByName(normalizedRoleName);
        if (roleOpt.isEmpty()) {
            return customResponse.get400Response(404);
        }

        UserBean user = userDto.toEntity();
        user.setRole(roleOpt.get());

        UserBean savedUser = userRepository.save(user);

        return customResponse.getCreatedResponse("Usuario creado exitosamente");
    }

    // Actualizar un usuario
    @Transactional
    public ResponseEntity<?> updateUser(Long id, UserDto userDto) {
        Optional<UserBean> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            UserBean user = existingUser.get();

            if (userDto.getFullName() != null) user.setFullName(userDto.getFullName());
            if (userDto.getEmail() != null) user.setEmail(userDto.getEmail());
            if (userDto.getPhoneNumber() != null) user.setPhoneNumber(userDto.getPhoneNumber());
            if (userDto.getUsername() != null) user.setUsername(userDto.getUsername());
            if (userDto.getPassword() != null) user.setPassword(userDto.getPassword());

            UserBean updatedUser = userRepository.save(user);
            return customResponse.getOkResponse(toDTO(updatedUser));
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Eliminar un usuario
    @Transactional
    public ResponseEntity<?> deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return customResponse.getOkResponse("Usuario eliminado exitosamente");
        } else {
            return customResponse.get400Response(404);
        }
    }

    private UserDto toDTO(UserBean user) {
        return UserDto.fromEntity(user);
    }
}