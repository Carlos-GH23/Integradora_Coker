package utez.edu.mx.integradora_coker.models.user;


import utez.edu.mx.integradora_coker.models.floor.FloorBean;

public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String username;
    private String password;
    private String roleName;
    private Long floorId;

    // Getters y Setters
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

    // Convertir de UserDto a UserBean
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