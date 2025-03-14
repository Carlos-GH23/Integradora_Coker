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

    // Get all floors
    public ResponseEntity<?> getAllFloors() {
        List<FloorDto> floors = floorRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(floors);
    }

    // Get floor by ID
    public ResponseEntity<?> getFloorById(Long id) {
        Optional<FloorBean> floor = floorRepository.findById(id);
        if (floor.isPresent()) {
            return customResponse.getOkResponse(toDTO(floor.get()));
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Create a floor
    @Transactional
    public ResponseEntity<?> createFloor(FloorDto floorDto) {
        FloorBean floor = floorDto.toEntity();
        FloorBean savedFloor = floorRepository.save(floor);
        return customResponse.getCreatedResponse("Floor created successfully");
    }

    // Update a floor
    @Transactional
    public ResponseEntity<?> updateFloor(Long id, FloorDto floorDto) {
        Optional<FloorBean> existingFloor = floorRepository.findById(id);
        if (existingFloor.isPresent()) {
            FloorBean floor = existingFloor.get();

            // Update only if values are not null
            if (floorDto.getIdentifier() != null) floor.setIdentifier(floorDto.getIdentifier());

            FloorBean updatedFloor = floorRepository.save(floor);
            return customResponse.getOkResponse(toDTO(updatedFloor));
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Delete a floor
    @Transactional
    public ResponseEntity<?> deleteFloor(Long id) {
        if (floorRepository.existsById(id)) {
            floorRepository.deleteById(id);
            return customResponse.getOkResponse("Floor deleted successfully");
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Convert from FloorBean to FloorDto
    private FloorDto toDTO(FloorBean floor) {
        return FloorDto.fromEntity(floor);
    }
}