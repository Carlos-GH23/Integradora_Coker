package utez.edu.mx.integradora_coker.models.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.integradora_coker.kernel.CustomResponse;
import utez.edu.mx.integradora_coker.models.Role.RoleBean;
import utez.edu.mx.integradora_coker.models.Role.RoleRepository;
import utez.edu.mx.integradora_coker.models.floor.FloorBean;
import utez.edu.mx.integradora_coker.models.floor.FloorRepository;

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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FloorRepository floorRepository;


    // Obtener todos los usuarios
    public ResponseEntity<?> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(users);
    }

    public ResponseEntity<?> getAllSecretary() {
        List<UserDto> users = userRepository.findByRoleId(2).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(users);
    }

    public ResponseEntity<?> getAllNurses() {
        List<UserDto> users = userRepository.findByRoleId(3).stream()
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
        String encryptedPassword = passwordEncoder.encode(userDto.getPassword());

        userDto.setPassword(encryptedPassword);

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

            if (userDto.getPassword() != null) {
                String encryptedPassword = passwordEncoder.encode(userDto.getPassword());
                user.setPassword(encryptedPassword);
            }

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


    @Transactional
    public ResponseEntity<?> assignFloorToUser(Long userId, Long floorId) {
        Optional<UserBean> userOpt = userRepository.findById(userId);
        Optional<FloorBean> floorOpt = floorRepository.findById(floorId);

        if (userOpt.isEmpty()) {
            return customResponse.getCustomResponse("Usuario no encontrado", "ERROR", HttpStatus.NOT_FOUND);
        }

        if (floorOpt.isEmpty()) {
            return customResponse.getCustomResponse("Piso no encontrado", "ERROR", HttpStatus.NOT_FOUND);
        }

        UserBean user = userOpt.get();
        FloorBean floor = floorOpt.get();

        String roleName = user.getRole().getName().toUpperCase();

        if (!roleName.equals("SECRETARY") && !roleName.equals("NURSE")) {
            return customResponse.getCustomResponse("Solo se pueden asignar pisos a secretarias o enfermeras", "ERROR", HttpStatus.BAD_REQUEST);
        }

        if (roleName.equals("SECRETARY")) {
            boolean alreadyAssigned = floor.getUsers().stream()
                    .anyMatch(u -> u.getRole().getName().equalsIgnoreCase("SECRETARY") && !u.getId().equals(userId));

            if (alreadyAssigned) {
                return customResponse.getCustomResponse("Ya hay una secretaria asignada a este piso", "ERROR", HttpStatus.CONFLICT);
            }

            user.setFloor(floor);
            floor.setOccupied(true);
        } else {
            user.setFloor(floor);
        }

        userRepository.save(user);
        floorRepository.save(floor);
        return customResponse.getOkResponse("Piso asignado correctamente");
    }


    @Transactional
    public ResponseEntity<?> unassignFloorFromUser(Long userId) {
        Optional<UserBean> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return customResponse.getCustomResponse("Usuario no encontrado", "ERROR", HttpStatus.NOT_FOUND);
        }

        UserBean user = userOpt.get();
        FloorBean currentFloor = user.getFloor();

        if (currentFloor == null) {
            return customResponse.getCustomResponse("El usuario no tiene piso asignado", "ERROR", HttpStatus.BAD_REQUEST);
        }

        String roleName = user.getRole().getName().toUpperCase();

        user.setFloor(null);
        userRepository.save(user);

        if (roleName.equals("SECRETARY")) {
            boolean stillHasSecretary = currentFloor.getUsers().stream()
                    .anyMatch(u -> u.getRole().getName().equalsIgnoreCase("SECRETARY") && !u.getId().equals(user.getId()));

            if (!stillHasSecretary) {
                currentFloor.setOccupied(false);
                floorRepository.save(currentFloor);
            }
        }

        return customResponse.getOkResponse("Piso desasignado correctamente");
    }

    private UserDto toDTO(UserBean user) {
        return UserDto.fromEntity(user);
    }

}





