package utez.edu.mx.integradora_coker.models.Bed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.integradora_coker.kernel.CustomResponse;
import utez.edu.mx.integradora_coker.models.floor.FloorBean;
import utez.edu.mx.integradora_coker.models.floor.FloorRepository;
import utez.edu.mx.integradora_coker.models.user.UserBean;
import utez.edu.mx.integradora_coker.models.user.UserRepository;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BedService {

    @Autowired
    private BedRepository bedRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FloorRepository floorRepository;
    @Autowired
    private CustomResponse customResponse;

    // Get all beds
    public ResponseEntity<?> getAllBeds() {
        List<BedDto> beds = bedRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(beds);
    }

    // Get bed by ID
    public ResponseEntity<?> getBedById(Long id) {
        Optional<BedBean> bed = bedRepository.findById(id);
        if (bed.isPresent()) {
            return customResponse.getOkResponse(toDTO(bed.get()));
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Create a bed
    // En tu método createBed
// Create a bed
    @Transactional
    public ResponseEntity<?> createBed(BedDto bedDto) {
        Optional<FloorBean> floor = floorRepository.findById(bedDto.getFloor().getId());
        if (!floor.isPresent()) {
            return customResponse.getCustomResponse("Ya existe esta cama", "ERROR", HttpStatus.BAD_REQUEST);
        }

        if (floor.get().getBeds().size() >= floor.get().getBednumber()) {
            return customResponse.getCustomResponse("No se pueden agregar más camas. El límite es " + floor.get().getBednumber(),"ERROR",HttpStatus.CONFLICT);
        }

        if (bedRepository.existsByIdentifierAndFloorId(
                bedDto.getIdentifier(),
                floor.get().getId())) {
            return customResponse.getCustomResponse("No se puede repetir el identificador en este piso", "ERROR", HttpStatus.BAD_REQUEST);

        }

        BedBean bed = new BedBean();
        bed.setOccupied(bedDto.getPatient() != null);
        bed.setIdentifier(bedDto.getIdentifier());
        bed.setFloor(floor.get());

        bedRepository.save(bed);
        return customResponse.getCreatedResponse("Cama creada exitosamente");
    }



    // Update a bed
    @Transactional
    public ResponseEntity<?> updateBed(Long id, BedDto bedDto) {
        Optional<BedBean> existingBed = bedRepository.findById(id);
        if (existingBed.isPresent()) {
            BedBean bed = existingBed.get();

            if (bedDto.getIdentifier() != null) bed.setIdentifier(bedDto.getIdentifier());
            if (bedDto.getUser() != null) bed.setUser(bedDto.getUser());
            if (bedDto.getPatient() != null) bed.setPatient(bedDto.getPatient());
            if (bedDto.getFloor() != null) {
                Optional<FloorBean> floor = floorRepository.findById(bedDto.getFloor().getId());
                if (!floor.isPresent()) return customResponse.get400Response(404);
                bed.setFloor(floor.get());
            }

            BedBean updatedBed = bedRepository.save(bed);
            return customResponse.getOkResponse(toDTO(updatedBed));
        } else {
            return customResponse.getCustomResponse("Error al actualizar", "ERROR", HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a bed
    @Transactional
    public ResponseEntity<?> deleteBed(Long id) {
        if (bedRepository.existsById(id)) {
            bedRepository.deleteById(id);
            return customResponse.getOkResponse("Cama eliminada exitosamente");
        } else {
            return customResponse.get400Response(404);
        }
    }

    @Transactional
    public ResponseEntity<?> registerBed(BedDto bedDto, String floorIdentifier) {
        Optional<FloorBean> floor = floorRepository.findByIdentifier(floorIdentifier);
        if (!floor.isPresent()) {
            return customResponse.get400Response(404);
        }

        BedBean bed = new BedBean();
        bed.setIdentifier(bedDto.getIdentifier());
        bed.setFloor(floor.get());
        bedRepository.save(bed);

        return customResponse.getCreatedResponse("Cama registrada exitosamente");
    }

    @Transactional
    public ResponseEntity<?> assignBedToUser(Long bedId, Long userId) {
        Optional<BedBean> bedOpt = bedRepository.findById(bedId);
        Optional<UserBean> userOpt = userRepository.findById(userId);

        if (!bedOpt.isPresent()) {
            return customResponse.getCustomResponse("Cama no encontrada", "ERROR", HttpStatus.NOT_FOUND);
        }
        if (!userOpt.isPresent()) {
            return customResponse.getCustomResponse("Usuario no encontrado", "ERROR", HttpStatus.NOT_FOUND);
        }

        BedBean bed = bedOpt.get();
        UserBean user = userOpt.get();

        if (!user.getRole().getName().equalsIgnoreCase("nurse")) {
            return customResponse.getCustomResponse("El usuario no tiene rol de enfermera", "ERROR", HttpStatus.FORBIDDEN);
        }

        if (user.getFloor() == null || bed.getFloor() == null ||
                !user.getFloor().getId().equals(bed.getFloor().getId())) {
            return customResponse.getCustomResponse("El usuario y la cama no pertenecen al mismo piso.", "ERROR", HttpStatus.FORBIDDEN);
        }

        bed.setUser(user);
        bedRepository.save(bed);

        return customResponse.getCustomResponse("Cama asignada a la enfermera exitosamente", "OK", HttpStatus.OK);
    }



    public ResponseEntity<?> getBedsAssignedToUser(Long userId) {
        Optional<UserBean> userOpt = userRepository.findById(userId);

        if (!userOpt.isPresent()) {
            return customResponse.getCustomResponse( "Usuario no encontrado", "ERROR", HttpStatus.NOT_FOUND);
        }

        UserBean user = userOpt.get();
        List<BedDto> assignedBeds = bedRepository.findBedsByAssignedUser(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return customResponse.getOkResponse(assignedBeds);
    }


    @Transactional
    public ResponseEntity<?> unassignBedFromUser(Long bedId) {
        Optional<BedBean> bedOpt = bedRepository.findById(bedId);

        if (!bedOpt.isPresent()) {
            return customResponse.getCustomResponse("Cama no encontrada","ERROR", HttpStatus.NOT_FOUND);
        }

        BedBean bed = bedOpt.get();
        bed.setUser(null);  
        bedRepository.save(bed);

        return customResponse.getOkResponse("Cama desasignada exitosamente");
    }



    // Convert from BedBean to BedDto
    private BedDto toDTO(BedBean bed) {
        return BedDto.fromEntity(bed);
    }
}