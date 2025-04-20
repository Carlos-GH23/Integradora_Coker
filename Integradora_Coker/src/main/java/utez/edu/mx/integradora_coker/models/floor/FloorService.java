package utez.edu.mx.integradora_coker.models.floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.integradora_coker.kernel.CustomResponse;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FloorService {

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private CustomResponse customResponse;

    public ResponseEntity<?> getAllFloors() {
        List<FloorDto> floors = floorRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(floors);
    }

    public ResponseEntity<?> getFloorById(Long id) {
        Optional<FloorBean> floor = floorRepository.findById(id);
        if (floor.isPresent()) {
            return customResponse.getOkResponse(toDTO(floor.get()));
        } else {
            return customResponse.get400Response(404);
        }
    }

    @Transactional
    public ResponseEntity<?> createFloor(FloorDto floorDto) {
        FloorBean floor = floorDto.toEntity();
        floor.setOccupied(false);
        floorRepository.save(floor);
        return customResponse.getCreatedResponse("Piso creado exitosamente");
    }


    @Transactional
    public ResponseEntity<?> updateFloor(Long id, FloorDto floorDto) {
        Optional<FloorBean> optionalFloor = floorRepository.findById(id);
        if (optionalFloor.isEmpty()) {
            return customResponse.get400Response(404);
        }

        FloorBean floor = optionalFloor.get();

        if (floorDto.getIdentifier() != null && !floorDto.getIdentifier().isBlank()) {
            floor.setIdentifier(floorDto.getIdentifier());
        }

        if (floorDto.getBednumber() > 0) {
            floor.setBednumber(floorDto.getBednumber());
        }

        floorRepository.save(floor);
        return customResponse.getOkResponse("Piso actualizado correctamente");
    }


    // Delete a floor
    @Transactional
    public ResponseEntity<?> deleteFloor(Long id) {
        if (floorRepository.existsById(id)) {
            floorRepository.deleteById(id);
            return customResponse.getOkResponse("Piso eliminado exitosamente");
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Convert from FloorBean to FloorDto
    private FloorDto toDTO(FloorBean floor) {
        return FloorDto.fromEntity(floor);
    }
}