package utez.edu.mx.integradora_coker.security.insterceptors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class CustomInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(CustomInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ip = convertIPv6toIPv4(request.getRemoteAddr());
        logger.info("Revisando la dirección IP de la solicitud...");
        logger.debug("Dirección IP recibida: {}", ip);

        if (isPrivateIP(ip)) {
            logger.warn("La dirección IP está bloqueada: {}", ip);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "La dirección está bloqueada");
            return false;
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }

    private String convertIPv6toIPv4(String ip) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ip);
            byte[] addressBytes = inetAddress.getAddress();

            if (addressBytes.length == 4) {
                return ip;
            }

            if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
                return "127.0.0.1";
            }

        } catch (UnknownHostException ex) {
            logger.error("No se pudo resolver la dirección IP: {}", ip, ex);
        }
        return ip; // En caso de error, regresa la IP original
    }

    private boolean isPrivateIP(String ip) {
        return ip.startsWith("192.168.") ||
                ip.startsWith("10.") ||
                ip.matches("^172\\.(1[6-9]|2[0-9]|3[0-1])\\..*") ||
                "127.0.0.1".equals(ip);
    }
}
