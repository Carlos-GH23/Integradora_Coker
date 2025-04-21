package utez.edu.mx.integradora_coker.models.Patient;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.integradora_coker.kernel.CustomResponse;
import utez.edu.mx.integradora_coker.models.Bed.BedBean;
import utez.edu.mx.integradora_coker.models.Bed.BedRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private CustomResponse customResponse;

    @Autowired
    private BedRepository bedRepository;

    public ResponseEntity<?> getAllPatients() {
        List<PatientDto> patients = patientRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(patients);
    }

    public ResponseEntity<?> getPatientById(Long id) {
        Optional<PatientBean> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            return customResponse.getOkResponse(toDTO(patient.get()));
        } else {
            return customResponse.get400Response(404);
        }
    }

    @Transactional
    public ResponseEntity<?> createPatient(PatientDto patientDto) {
        try {
            if (patientDto == null) {
                return customResponse.getCustomResponse(
                        "Los datos del paciente no pueden ser nulos", "ERROR", HttpStatus.BAD_REQUEST);
            }
            String sanitizedName = sanitizeInput(patientDto.getFullName());
            if (!isValidName(sanitizedName)) {
                return customResponse.getCustomResponse(
                        "El nombre contiene caracteres no permitidos", "ERROR", HttpStatus.BAD_REQUEST);
            }
            patientDto.setFullName(sanitizedName);
            PatientBean patient = patientDto.toEntity();
            PatientBean saved = patientRepository.save(patient);
            return customResponse.getOkResponse(toDTO(saved));
        } catch (IllegalArgumentException e) {
            return customResponse.getCustomResponse(e.getMessage(), "ERROR", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return customResponse.getCustomResponse(
                    "Error al crear paciente: " + e.getMessage(), "ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<?> updatePatient(Long id, PatientDto patientDto) {
        try {
            if (patientDto == null) {
                return customResponse.getCustomResponse(
                        "Los datos del paciente no pueden ser nulos", "ERROR", HttpStatus.BAD_REQUEST);
            }
            Optional<PatientBean> existing = patientRepository.findById(id);
            if (existing.isEmpty()) {
                return customResponse.get400Response(404);
            }
            PatientBean patient = existing.get();
            if (patientDto.getFullName() != null) {
                String sanitizedName = sanitizeInput(patientDto.getFullName());
                if (!isValidName(sanitizedName)) {
                    return customResponse.getCustomResponse(
                            "El nombre contiene caracteres no permitidos", "ERROR", HttpStatus.BAD_REQUEST);
                }
                patient.setFullName(sanitizedName);
            }
            if (patientDto.getBed() != null) {
                patient.setBed(patientDto.getBed());
            }
            PatientBean updated = patientRepository.save(patient);
            return customResponse.getOkResponse(toDTO(updated));
        } catch (IllegalArgumentException e) {
            return customResponse.getCustomResponse(e.getMessage(), "ERROR", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return customResponse.getCustomResponse(
                    "Error al actualizar paciente: " + e.getMessage(), "ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<?> deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return customResponse.getOkResponse("Paciente eliminado de forma exitosa");
        }
        return customResponse.get400Response(404);
    }

    @Transactional
    public ResponseEntity<?> assignBedToPatient(Long patientId, Long bedId) {
        try {
            Optional<PatientBean> pOpt = patientRepository.findById(patientId);
            Optional<BedBean> bOpt = bedRepository.findById(bedId);
            if (pOpt.isEmpty() || bOpt.isEmpty()) {
                return customResponse.get400Response(404);
            }
            BedBean bed = bOpt.get();
            if (bed.isOccupied()) {
                return customResponse.getCustomResponse(
                        "La cama ya está ocupada", "ERROR", HttpStatus.CONFLICT);
            }
            PatientBean patient = pOpt.get();
            bed.setPatient(patient);
            bed.setOccupied(true);
            patient.setBed(bed);
            bedRepository.save(bed);
            patientRepository.save(patient);
            return customResponse.getOkResponse("Cama asignada al paciente correctamente");
        } catch (Exception e) {
            return customResponse.getCustomResponse(
                    "Error al asignar cama: " + e.getMessage(), "ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<?> unassignBedFromPatient(Long patientId) {
        try {
            Optional<PatientBean> pOpt = patientRepository.findById(patientId);
            if (pOpt.isEmpty()) {
                return customResponse.get400Response(404);
            }
            PatientBean patient = pOpt.get();
            BedBean bed = patient.getBed();
            if (bed == null) {
                return customResponse.getCustomResponse(
                        "El paciente no tiene cama asignada", "ERROR", HttpStatus.CONFLICT);
            }
            bed.setPatient(null);
            bed.setOccupied(false);
            patient.setBed(null);
            bedRepository.save(bed);
            patientRepository.save(patient);
            return customResponse.getOkResponse("Cama desasignada correctamente");
        } catch (Exception e) {
            return customResponse.getCustomResponse(
                    "Error al desasignar cama: " + e.getMessage(), "ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private PatientDto toDTO(PatientBean patient) {
        return PatientDto.fromEntity(patient);
    }

    private String sanitizeInput(String input) {
        if (input == null) return null;
        String clean = Jsoup.clean(input, Safelist.basic());
        if (!input.trim().equals(clean.trim())) {
            throw new IllegalArgumentException("El campo contiene contenido no permitido");
        }
        return clean.trim();
    }

    private boolean isValidName(String name) {
        if (name == null || name.trim().isEmpty()) return false;
        return name.matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")
                && name.length() >= 2
                && name.length() <= 100;
    }
}
