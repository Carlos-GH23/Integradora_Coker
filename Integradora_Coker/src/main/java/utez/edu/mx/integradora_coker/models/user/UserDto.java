package utez.edu.mx.integradora_coker.models.user;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import utez.edu.mx.integradora_coker.models.floor.FloorBean;

public class UserDto {

    private Long id;

    @NotNull(message = "El nombre completo no puede ser nulo")
    @Size(min = 3, max = 100, message = "El nombre completo debe tener entre 3 y 100 caracteres")
    private String fullName;

    @NotNull(message = "El correo electrónico no puede ser nulo")
    @Email(message = "El correo electrónico no tiene un formato válido")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "El número de teléfono debe ser válido y contener entre 10 y 15 dígitos")
    private String phoneNumber;

    @NotNull(message = "El nombre de usuario no puede ser nulo")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "El nombre de usuario solo puede contener letras, números y guiones bajos")
    private String username;

    @NotNull(message = "La contraseña no puede ser nula")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}", message = "La contraseña debe tener al menos 8 caracteres, con al menos una letra mayúscula, una minúscula y un número")
    private String password;

    @NotNull(message = "El rol no puede ser nulo")
    private String roleName;
    private Long floorId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Long getFloorId() {
        return floorId;
    }

    public void setFloorId(Long floorId) {
        this.floorId = floorId;
    }

    // Convertir de UserBean a UserDto
    public static UserDto fromEntity(UserBean user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setUsername(user.getUsername());
        dto.setPassword(user.getPassword());
        dto.setRoleName(user.getRole().getName());
        if (user.getFloor() != null) {
            dto.setFloorId(user.getFloor().getId());
        }
        return dto;
    }

    public UserBean toEntity() {
        UserBean user = new UserBean();
        user.setId(this.id);
        user.setFullName(this.fullName);
        user.setEmail(this.email);
        user.setPhoneNumber(this.phoneNumber);
        user.setUsername(this.username);
        user.setPassword(this.password);
        if (this.floorId != null) {
            FloorBean floor = new FloorBean();
            floor.setId(this.floorId);
            user.setFloor(floor);
        }
        return user;
    }
}