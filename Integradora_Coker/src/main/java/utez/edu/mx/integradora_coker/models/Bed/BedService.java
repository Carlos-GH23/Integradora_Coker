package utez.edu.mx.integradora_coker.models.Bed;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
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

    public ResponseEntity<?> getAllBeds() {
        List<BedDto> beds = bedRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(beds);
    }

    public ResponseEntity<?> getBedById(Long id) {
        Optional<BedBean> bed = bedRepository.findById(id);
        if (bed.isPresent()) {
            return customResponse.getOkResponse(toDTO(bed.get()));
        } else {
            return customResponse.get400Response(404);
        }
    }

    @Transactional
    public ResponseEntity<?> createBed(BedDto bedDto) {
        try {
            validateBedDto(bedDto);
            String identifier = sanitizeIdentifier(bedDto.getIdentifier());
            bedDto.setIdentifier(identifier);
            Optional<FloorBean> floor = floorRepository.findById(bedDto.getFloor().getId());
            if (floor.isEmpty()) {
                return customResponse.getCustomResponse("Piso no encontrado", "ERROR", HttpStatus.NOT_FOUND);
            }
            FloorBean floorBean = floor.get();
            if (floorBean.getBeds().size() >= floorBean.getBednumber()) {
                return customResponse.getCustomResponse(
                        "No se pueden agregar más camas. El límite es " + floorBean.getBednumber(),
                        "ERROR", HttpStatus.CONFLICT);
            }
            if (bedRepository.existsByIdentifierAndFloorId(identifier, floorBean.getId())) {
                return customResponse.getCustomResponse(
                        "No se puede repetir el identificador en este piso", "ERROR", HttpStatus.BAD_REQUEST);
            }
            BedBean bed = new BedBean();
            bed.setOccupied(bedDto.getPatient() != null);
            bed.setIdentifier(identifier);
            bed.setFloor(floorBean);
            bedRepository.save(bed);
            return customResponse.getCreatedResponse("Cama creada exitosamente");
        } catch (IllegalArgumentException e) {
            return customResponse.getCustomResponse(e.getMessage(), "ERROR", HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    public ResponseEntity<?> updateBed(Long id, BedDto bedDto) {
        try {
            if (bedDto == null) {
                throw new IllegalArgumentException("Los datos de la cama no pueden ser nulos");
            }
            Optional<BedBean> existing = bedRepository.findById(id);
            if (existing.isEmpty()) {
                return customResponse.getCustomResponse("Cama no encontrada", "ERROR", HttpStatus.NOT_FOUND);
            }
            BedBean bed = existing.get();
            if (bedDto.getIdentifier() != null) {
                String identifier = sanitizeIdentifier(bedDto.getIdentifier());
                bed.setIdentifier(identifier);
            }
            if (bedDto.getUser() != null && bedDto.getUser().getId() != null) {
                Optional<UserBean> userOpt = userRepository.findById(bedDto.getUser().getId());
                if (userOpt.isEmpty() || !"nurse".equalsIgnoreCase(userOpt.get().getRole().getName())) {
                    return customResponse.getCustomResponse(
                            "Solo se pueden asignar enfermeras a las camas", "ERROR", HttpStatus.BAD_REQUEST);
                }
                bed.setUser(userOpt.get());
            }
            if (bedDto.getPatient() != null) {
                bed.setPatient(bedDto.getPatient());
                bed.setOccupied(true);
            } else {
                bed.setOccupied(false);
            }
            if (bedDto.getFloor() != null && bedDto.getFloor().getId() != null) {
                Optional<FloorBean> floorOpt = floorRepository.findById(bedDto.getFloor().getId());
                if (floorOpt.isEmpty()) {
                    return customResponse.getCustomResponse("Piso no encontrado", "ERROR", HttpStatus.NOT_FOUND);
                }
                FloorBean targetFloor = floorOpt.get();
                if (targetFloor.getBeds().size() >= targetFloor.getBednumber()) {
                    return customResponse.getCustomResponse(
                            "No se pueden mover la cama. El piso destino está lleno", "ERROR", HttpStatus.CONFLICT);
                }
                bed.setFloor(targetFloor);
            }
            BedBean updated = bedRepository.save(bed);
            return customResponse.getOkResponse(toDTO(updated));
        } catch (IllegalArgumentException e) {
            return customResponse.getCustomResponse(e.getMessage(), "ERROR", HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    public ResponseEntity<?> deleteBed(Long id) {
        if (bedRepository.existsById(id)) {
            bedRepository.deleteById(id);
            return customResponse.getOkResponse("Cama eliminada exitosamente");
        }
        return customResponse.get400Response(404);
    }

    @Transactional
    public ResponseEntity<?> registerBed(BedDto bedDto, String floorIdentifier) {
        Optional<FloorBean> floor = floorRepository.findByIdentifier(sanitizeIdentifier(floorIdentifier));
        if (floor.isEmpty()) {
            return customResponse.get400Response(404);
        }
        BedBean bed = new BedBean();
        bed.setIdentifier(sanitizeIdentifier(bedDto.getIdentifier()));
        bed.setFloor(floor.get());
        bedRepository.save(bed);
        return customResponse.getCreatedResponse("Cama registrada exitosamente");
    }

    @Transactional
    public ResponseEntity<?> assignBedToUser(Long bedId, Long userId) {
        Optional<BedBean> bedOpt = bedRepository.findById(bedId);
        Optional<UserBean> userOpt = userRepository.findById(userId);
        if (bedOpt.isEmpty() || userOpt.isEmpty()) {
            return customResponse.getCustomResponse(
                    bedOpt.isEmpty() ? "Cama no encontrada" : "Usuario no encontrado",
                    "ERROR", HttpStatus.NOT_FOUND);
        }
        BedBean bed = bedOpt.get();
        UserBean user = userOpt.get();
        if (!"nurse".equalsIgnoreCase(user.getRole().getName())) {
            return customResponse.getCustomResponse(
                    "El usuario no tiene rol de enfermera", "ERROR", HttpStatus.FORBIDDEN);
        }
        if (user.getFloor() == null || bed.getFloor() == null
                || !user.getFloor().getId().equals(bed.getFloor().getId())) {
            return customResponse.getCustomResponse(
                    "El usuario y la cama no pertenecen al mismo piso.", "ERROR", HttpStatus.FORBIDDEN);
        }
        bed.setUser(user);
        bedRepository.save(bed);
        return customResponse.getCustomResponse(
                "Cama asignada a la enfermera exitosamente", "OK", HttpStatus.OK);
    }

    public ResponseEntity<?> getBedsAssignedToUser(Long userId) {
        Optional<UserBean> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return customResponse.getCustomResponse("Usuario no encontrado", "ERROR", HttpStatus.NOT_FOUND);
        }
        List<BedDto> assignedBeds = bedRepository.findBedsByAssignedUser(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(assignedBeds);
    }

    @Transactional
    public ResponseEntity<?> unassignBedFromUser(Long bedId) {
        Optional<BedBean> bedOpt = bedRepository.findById(bedId);
        if (bedOpt.isEmpty()) {
            return customResponse.getCustomResponse("Cama no encontrada", "ERROR", HttpStatus.NOT_FOUND);
        }
        BedBean bed = bedOpt.get();
        bed.setUser(null);
        bedRepository.save(bed);
        return customResponse.getOkResponse("Cama desasignada exitosamente");
    }

    private String sanitizeIdentifier(String input) {
        if (input == null) return null;
        String clean = Jsoup.clean(input, Safelist.basic());
        if (!input.trim().equals(clean.trim())) {
            throw new IllegalArgumentException("Identificador contiene contenido no permitido");
        }
        return clean.trim();
    }

    private void validateBedDto(BedDto bedDto) {
        if (bedDto == null) {
            throw new IllegalArgumentException("Los datos de la cama no pueden ser nulos");
        }
        if (bedDto.getIdentifier() == null || bedDto.getIdentifier().trim().isEmpty()) {
            throw new IllegalArgumentException("El identificador de la cama es requerido");
        }
        if (bedDto.getFloor() == null || bedDto.getFloor().getId() == null) {
            throw new IllegalArgumentException("El piso es requerido");
        }
    }

    private BedDto toDTO(BedBean bed) {
        return BedDto.fromEntity(bed);
    }
}
