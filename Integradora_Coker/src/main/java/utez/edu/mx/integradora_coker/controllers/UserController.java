package utez.edu.mx.integradora_coker.controllers;

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

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/create/{roleName}")
    public ResponseEntity<?> createUser(@PathVariable String roleName, @RequestBody UserDto userDto) {
        return userService.createUserWithRole(userDto, roleName);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return userService.updateUser(id, userDto);
    }

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