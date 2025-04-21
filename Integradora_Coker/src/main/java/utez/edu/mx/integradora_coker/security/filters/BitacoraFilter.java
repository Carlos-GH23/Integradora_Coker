package utez.edu.mx.integradora_coker.security.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utez.edu.mx.integradora_coker.models.Bitacora.BitacoraBean;
import utez.edu.mx.integradora_coker.models.Bitacora.BitacoraRepository;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class BitacoraFilter extends OncePerRequestFilter {

    private final BitacoraRepository bitacoraRepository;
    private static final Logger logger = LoggerFactory.getLogger(BitacoraFilter.class);

    public BitacoraFilter(BitacoraRepository bitacoraRepository) {
        this.bitacoraRepository = bitacoraRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String usuario = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : "ANÓNIMO";
        String metodo = request.getMethod();
        String endpoint = request.getRequestURI();

        logger.info("Solicitud recibida: {} {} por usuario {}", metodo, endpoint, usuario);

        // Guardamos la acción en la bitácora
        try {
            BitacoraBean bitacora = new BitacoraBean(usuario, metodo, endpoint, LocalDateTime.now());
            bitacoraRepository.save(bitacora);
            logger.info("Acción registrada en la bitácora con éxito.");
        } catch (Exception e) {
            logger.error("Error al guardar la bitácora para la solicitud {} {}", metodo, endpoint, e);
        }

        filterChain.doFilter(request, response);
    }
}
