package utez.edu.mx.integradora_coker.models.Bitacora;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BitacoraService {
    @Autowired
    private BitacoraRepository bitacoraRepository;

    public List<BitacoraBean> getAllBitacoras() {
        List<BitacoraBean> bitacoras = bitacoraRepository.findAll();
        return bitacoras;
    }


}
