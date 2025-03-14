package utez.edu.mx.integradora_coker.security.insterceptors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class CustomInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ip = conertIPv6toIPv4(request.getRemoteAddr());
        System.out.println("Reviando la direccion IP de la solicitud...");
        System.out.println(ip);
        if(ip.startsWith("192.168.")){
            System.out.println("La dirección IP está bloqueada...");
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "La dirección esta bloqueada");
            return false;
        }
            return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
    private String conertIPv6toIPv4(String ip){
        try {
            InetAddress inetAddress = InetAddress.getByName(ip);
            byte[] adressBytes = inetAddress.getAddress();
            if(adressBytes.length == 4){
                return ip;
            }
            if("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)){
                return "127.0.0.1";
            }
        }catch (UnknownHostException ex){
            System.out.println("La dirección del host es desconocida...");
            ex.printStackTrace();
        }
        return ip;
    }
}
