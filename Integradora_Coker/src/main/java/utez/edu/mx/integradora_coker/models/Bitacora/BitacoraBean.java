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



}
