package utez.edu.mx.integradora_coker.models.Bitacora;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Log")
public class BitacoraBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String usuario;
    private String metodoHttp;
    private String endpoint;
    private LocalDateTime fechaHora;

    public BitacoraBean(String usuario, String metodoHttp, String endpoint, LocalDateTime fechaHora) {
        this.usuario = usuario;
        this.metodoHttp = metodoHttp;
        this.endpoint = endpoint;
        this.fechaHora = fechaHora;
    }

    public BitacoraBean() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getMetodoHttp() {
        return metodoHttp;
    }

    public void setMetodoHttp(String metodoHttp) {
        this.metodoHttp = metodoHttp;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

}
