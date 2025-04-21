package utez.edu.mx.integradora_coker.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import utez.edu.mx.integradora_coker.security.filters.AuthFilter;
import utez.edu.mx.integradora_coker.security.insterceptors.CustomInterceptor;


@EnableWebSecurity
@Configuration
public class MainSecurity implements WebMvcConfigurer {

    @Autowired
    private AuthFilter authFilter;

    @Autowired
    private CustomInterceptor customInterceptor;

    private final static String[] WHITE_LIST = {
            "/api/auth/login",
    };

    public static String[] getWHITE_LIST() {
        return WHITE_LIST;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(WHITE_LIST).permitAll()
                        .requestMatchers("/api/users/create/**", "/api/bitacora", "/api/users/all", "/api/patients/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/assign-floor", "/api/users/unassign-floor/**").hasAnyRole("ADMIN", "SECRETARY")
                        .requestMatchers("/api/patients/create", "/api/patients/edit/**").hasAnyRole("NURSE", "SECRETARY")
                        .requestMatchers("/api/users/{id}").hasAnyRole("SECRETARY", "ADMIN")
                        .requestMatchers("/api/floors/**", "/api/beds/**").hasAnyRole("ADMIN", "SECRETARY")
                        .requestMatchers("/api/beds/assigned", "/api/patients/assign-bed", "/api/patients/unassign-bed/**").hasAnyRole("NURSE", "SECRETARY")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(customInterceptor).addPathPatterns("/api/test/secured");
    }
}