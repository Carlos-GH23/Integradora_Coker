package utez.edu.mx.integradora_coker.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.integradora_coker.models.Bitacora.BitacoraBean;
import utez.edu.mx.integradora_coker.models.Bitacora.BitacoraService;

import java.util.List;

@RestController
@RequestMapping("/api/bitacora")
@CrossOrigin("*")
public class BitacoraController {

    @Autowired
    private BitacoraService bitacoraService;

    @GetMapping
    public ResponseEntity<List<BitacoraBean>> getAllBitacoras() {
        List<BitacoraBean> bitacoras = bitacoraService.getAllBitacoras();
        return ResponseEntity.ok(bitacoras);
    }
}
