package utez.edu.mx.integradora_coker.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import utez.edu.mx.integradora_coker.security.filters.AuthFilter;
import utez.edu.mx.integradora_coker.security.insterceptors.CustomInterceptor;

import java.util.List;


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
        http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(WHITE_LIST).permitAll()

                        .requestMatchers("/api/users/**").hasAnyRole("SECRETARY", "ADMIN")
                        .requestMatchers( "/api/bitacora").hasRole("ADMIN")
                        .requestMatchers("/api/floors/**").hasAnyRole("ADMIN", "SECRETARY")
                        .requestMatchers("/api/beds/assigned").hasAnyRole("NURSE", "SECRETARY")
                        .requestMatchers("/api/patients/assign-bed").hasAnyRole("NURSE", "SECRETARY")
                        .requestMatchers("/api/patients/unassign-bed/**").hasAnyRole("NURSE", "SECRETARY")


                        .requestMatchers(HttpMethod.GET, "/api/beds/**").hasAnyRole("SECRETARY", "NURSE", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/beds/**").hasAnyRole("SECRETARY", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/beds/**").hasAnyRole("SECRETARY", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/beds/**").hasAnyRole("SECRETARY", "ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/patients/**").hasAnyRole("NURSE", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/patients/**").hasAnyRole("NURSE", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/patients/**").hasAnyRole("NURSE", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/patients/**").hasAnyRole("NURSE", "ADMIN")


                        .requestMatchers("/api/users/assign-floor", "/api/users/unassign-floor/**","/api/users/create/NURSE").hasAnyRole("ADMIN", "SECRETARY")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173/")); // Solo este origen
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); // Puedes afinar esto si quieres más seguridad
        configuration.setAllowCredentials(true); // Si necesitas cookies o headers con credenciales

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(customInterceptor).addPathPatterns("/api/test/secured");
    }
}