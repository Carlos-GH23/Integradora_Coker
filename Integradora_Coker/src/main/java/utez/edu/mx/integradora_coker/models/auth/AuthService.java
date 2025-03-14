package utez.edu.mx.integradora_coker.models.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.integradora_coker.kernel.CustomResponse;
import utez.edu.mx.integradora_coker.models.user.UserBean;
import utez.edu.mx.integradora_coker.models.user.UserRepository;


import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomResponse customResponse;

    @Transactional(readOnly = true)
    public ResponseEntity<?> login(LoginDTO dto) {
        Optional<UserBean> found = userRepository.findByUsernameAndPassword(dto.getUsername(), dto.getPassword());

        if (found.isEmpty()) {
            return customResponse.get400Response(404);
        } else {
            UserBean user = found.get();
            return customResponse.getOkResponse("bearertoken." + user.getUsername() + ".voidtoken");
        }
    }
}