package utez.edu.mx.integradora_coker.models.floor;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        try {
            if (floorDto == null) {
                return customResponse.getCustomResponse(
                        "Los datos del piso no pueden ser nulos",
                        "ERROR",
                        HttpStatus.BAD_REQUEST);
            }

            String cleanedIdentifier = sanitizeInput(floorDto.getIdentifier());
            if (!isValidIdentifier(cleanedIdentifier)) {
                return customResponse.getCustomResponse(
                        "El identificador contiene caracteres no permitidos o longitud inválida",
                        "ERROR",
                        HttpStatus.BAD_REQUEST);
            }
            floorDto.setIdentifier(cleanedIdentifier);

            if (floorDto.getBednumber() <= 0) {
                return customResponse.getCustomResponse(
                        "El número de camas debe ser mayor que cero",
                        "ERROR",
                        HttpStatus.BAD_REQUEST);
            }

            FloorBean floor = floorDto.toEntity();
            floor.setOccupied(false);
            FloorBean saved = floorRepository.save(floor);
            return customResponse.getOkResponse(toDTO(saved));

        } catch (IllegalArgumentException e) {
            return customResponse.getCustomResponse(
                    "Contenido no permitido en los campos: " + e.getMessage(),
                    "ERROR",
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return customResponse.getCustomResponse(
                    "Error al crear piso: " + e.getMessage(),
                    "ERROR",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<?> updateFloor(Long id, FloorDto floorDto) {
        try {
            if (floorDto == null) {
                return customResponse.getCustomResponse(
                        "Los datos del piso no pueden ser nulos",
                        "ERROR",
                        HttpStatus.BAD_REQUEST);
            }

            Optional<FloorBean> optionalFloor = floorRepository.findById(id);
            if (optionalFloor.isEmpty()) {
                return customResponse.get400Response(404);
            }
            FloorBean floor = optionalFloor.get();

            if (floorDto.getIdentifier() != null) {
                String cleanedIdentifier = sanitizeInput(floorDto.getIdentifier());
                if (!isValidIdentifier(cleanedIdentifier)) {
                    return customResponse.getCustomResponse(
                            "El identificador contiene caracteres no permitidos o longitud inválida",
                            "ERROR",
                            HttpStatus.BAD_REQUEST);
                }
                floor.setIdentifier(cleanedIdentifier);
            }

            if (floorDto.getBednumber() > 0) {
                floor.setBednumber(floorDto.getBednumber());
            }

            FloorBean updated = floorRepository.save(floor);
            return customResponse.getOkResponse(toDTO(updated));

        } catch (IllegalArgumentException e) {
            return customResponse.getCustomResponse(
                    "Contenido no permitido en los campos: " + e.getMessage(),
                    "ERROR",
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return customResponse.getCustomResponse(
                    "Error al actualizar piso: " + e.getMessage(),
                    "ERROR",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar un piso
    @Transactional
    public ResponseEntity<?> deleteFloor(Long id) {
        if (floorRepository.existsById(id)) {
            floorRepository.deleteById(id);
            return customResponse.getOkResponse("Piso eliminado exitosamente");
        } else {
            return customResponse.get400Response(404);
        }
    }

    private FloorDto toDTO(FloorBean floor) {
        return FloorDto.fromEntity(floor);
    }


    private String sanitizeInput(String input) {
        if (input == null) return null;
        if (containsMaliciousContent(input)) {
            throw new IllegalArgumentException("El campo contiene contenido no permitido");
        }
        return Jsoup.clean(input, Safelist.basic());
    }


    private boolean containsMaliciousContent(String input) {
        String noTags = Jsoup.clean(input, Safelist.none());
        return !noTags.equals(input)
                || input.matches(".*javascript:.*")
                || input.matches(".*\\b(onload|onerror|onclick)\\b.*");
    }


    private boolean isValidIdentifier(String identifier) {
        if (identifier == null || identifier.isEmpty()) return false;
        return identifier.length() <= 50 && identifier.matches("^[A-Za-z0-9\\s-]+$");

    }
}
