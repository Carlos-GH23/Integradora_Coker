package utez.edu.mx.integradora_coker.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.integradora_coker.models.user.UserAssigmentDto;
import utez.edu.mx.integradora_coker.models.user.UserDto;
import utez.edu.mx.integradora_coker.models.user.UserService;


@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/Secretarias")
    public ResponseEntity<?> getAllSecretarias() {return userService.getAllSecretary();}

    @GetMapping("/Enfermeras")
    public ResponseEntity<?> getAllNurses() {return userService.getAllNurses();}

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Crear un usuario con un rol específico
    @PostMapping("/create/{roleName}")
    public ResponseEntity<?> createUser(@PathVariable String roleName,@Valid @RequestBody UserDto userDto) {
        return userService.createUserWithRole(userDto, roleName);
    }

    // Actualizar un usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,@Valid @RequestBody UserDto userDto) {
        return userService.updateUser(id, userDto);
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @PostMapping("/assign-floor")
    public ResponseEntity<?> assignFloor(@RequestBody UserAssigmentDto data) {
        return userService.assignFloorToUser(data.getUserId(), data.getfloorId());
    }

    @DeleteMapping("/unassign-floor/{userId}")
    public ResponseEntity<?> unassignFloor(@PathVariable Long userId) {
        return userService.unassignFloorFromUser(userId);
    }

}