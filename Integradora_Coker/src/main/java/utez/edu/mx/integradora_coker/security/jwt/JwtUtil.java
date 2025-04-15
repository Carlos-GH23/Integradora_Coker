package utez.edu.mx.integradora_coker.security.jwt;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import utez.edu.mx.integradora_coker.models.user.UserBean;

import java.util.Date;


@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;


    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .before(new Date());
    }

    public String generateToken(UserBean user) {
        return Jwts.builder()
                .claim("id", user.getId())
                .claim("fullName", user.getFullName())
                .claim("role", user.getRole().getName())
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String getSecret() {
        return this.secret;
    }

}

