package utez.edu.mx.integradora_coker.models.auth;

public class LoginDTO {
    private String username, password;

    public LoginDTO() {
    }

    public LoginDTO(String password, String username) {
        this.password = password;
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
