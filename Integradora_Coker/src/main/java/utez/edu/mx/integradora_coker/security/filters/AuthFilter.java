package utez.edu.mx.integradora_coker.security.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import utez.edu.mx.integradora_coker.models.user.UserBean;
import utez.edu.mx.integradora_coker.models.user.UserRepository;
import utez.edu.mx.integradora_coker.security.MainSecurity;


import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class AuthFilter extends OncePerRequestFilter {
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String AUTH_HEADER = request.getHeader("Authorization");
        Set<String> whitelist = Arrays.stream(MainSecurity.getWHITE_LIST()).collect(Collectors.toSet());
        String token;
        UserBean user = null;

        if (!whitelist.contains(request.getRequestURI())) {
            System.out.println("Método de la solicitud: " + request.getMethod());
            System.out.println("Ruta a la que se quiere acceder: " + request.getRequestURI());
            System.out.println("Verificando los encabezados de la solicitud...");

            if (AUTH_HEADER != null && AUTH_HEADER.startsWith("Bearer ")) {
                token = AUTH_HEADER.substring(7);
                Optional<UserBean> userOpt = userRepository.findByUsername(token.split("\\.")[1]);

                System.out.println("Verificando que el usuario existe...");
                if (userOpt.isPresent() && token != null) {
                    user = userOpt.get();
                    List<GrantedAuthority> authorities = Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + user.getRole().getName().toUpperCase())
                    );
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            user.getUsername(), null, authorities
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("El token de seguridad se ha registrado");
                } else {
                    System.out.println("El usuario no existe...");
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "El usuario no existe");
                    return;
                }
            } else {
                System.out.println("El usuario no tiene autorización");
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Sin autorización");
                return;
            }
        } else {
            System.out.println("La ruta solicitada está dentro de la white list...");
        }

        filterChain.doFilter(request, response);
        System.out.println("Cierre del filtro Authfilter");
    }
}