package utez.edu.mx.integradora_coker.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import utez.edu.mx.integradora_coker.models.Role.RoleBean;
import utez.edu.mx.integradora_coker.models.Role.RoleRepository;
import utez.edu.mx.integradora_coker.models.user.UserBean;
import utez.edu.mx.integradora_coker.models.user.UserRepository;


@Component
public class InitialConfig implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createInitialRoles();
        createInitialUsers();
    }

    private void createInitialRoles() {
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            RoleBean adminRole = new RoleBean();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
        }

        if (roleRepository.findByName("SECRETARY").isEmpty()) {
            RoleBean secretaryRole = new RoleBean();
            secretaryRole.setName("SECRETARY");
            roleRepository.save(secretaryRole);
        }

        if (roleRepository.findByName("NURSE").isEmpty()) {
            RoleBean nurseRole = new RoleBean();
            nurseRole.setName("NURSE");
            roleRepository.save(nurseRole);
        }
    }

    private void createInitialUsers() {
        if (!userRepository.findByUsername("admin").isPresent()) {
            RoleBean adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));

            UserBean adminUser = new UserBean();
            adminUser.setFullName("Administrador");
            adminUser.setEmail("admin@utez.edu.mx");
            adminUser.setPhoneNumber("1234567890");
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123")); // Contraseña encriptada
            adminUser.setRole(adminRole);

            userRepository.save(adminUser);
        }

        if (!userRepository.findByUsername("secretary").isPresent()) { // Usar !isPresent()
            RoleBean secretaryRole = roleRepository.findByName("SECRETARY")
                    .orElseThrow(() -> new RuntimeException("Rol SECRETARY no encontrado"));

            UserBean secretaryUser = new UserBean();
            secretaryUser.setFullName("Secretaria");
            secretaryUser.setEmail("secretary@utez.edu.mx");
            secretaryUser.setPhoneNumber("0987654321");
            secretaryUser.setUsername("secretary");
            secretaryUser.setPassword(passwordEncoder.encode("secretary123")); // Contraseña encriptada
            secretaryUser.setRole(secretaryRole);

            userRepository.save(secretaryUser);
        }

        if (!userRepository.findByUsername("nurse").isPresent()) { // Usar !isPresent()
            RoleBean nurseRole = roleRepository.findByName("NURSE")
                    .orElseThrow(() -> new RuntimeException("Rol NURSE no encontrado"));

            UserBean nurseUser = new UserBean();
            nurseUser.setFullName("Enfermera");
            nurseUser.setEmail("nurse@utez.edu.mx");
            nurseUser.setPhoneNumber("1122334455");
            nurseUser.setUsername("nurse");
            nurseUser.setPassword(passwordEncoder.encode("nurse123")); // Contraseña encriptada
            nurseUser.setRole(nurseRole);

            userRepository.save(nurseUser);
        }
    }
}