package utez.edu.mx.integradora_coker.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                        .requestMatchers("/api/users/create/**").hasRole("ADMIN")
                        .requestMatchers("/api/patients/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/all", "/api/users/{id}", "/api/users/{id}").hasAnyRole("ADMIN","SECRETARY")
                        .requestMatchers("/api/floors/**", "/api/beds/**").hasAnyRole("ADMIN", "SECRETARY")
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