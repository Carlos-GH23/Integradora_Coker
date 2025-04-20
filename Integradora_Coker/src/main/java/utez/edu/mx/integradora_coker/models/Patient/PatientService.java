package utez.edu.mx.integradora_coker.models.Patient;

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

    // Get all patients
    public ResponseEntity<?> getAllPatients() {
        List<PatientDto> patients = patientRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return customResponse.getOkResponse(patients);
    }

    // Get patient by ID
    public ResponseEntity<?> getPatientById(Long id) {
        Optional<PatientBean> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            return customResponse.getOkResponse(toDTO(patient.get()));
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Create a patient
    @Transactional
    public ResponseEntity<?> createPatient(PatientDto patientDto) {
        PatientBean patient = patientDto.toEntity();
        PatientBean savedPatient = patientRepository.save(patient);
        return customResponse.getCreatedResponse("Patient created successfully");
    }

    // Update a patient
    @Transactional
    public ResponseEntity<?> updatePatient(Long id, PatientDto patientDto) {
        Optional<PatientBean> existingPatient = patientRepository.findById(id);
        if (existingPatient.isPresent()) {
            PatientBean patient = existingPatient.get();

            // Update only if values are not null
            if (patientDto.getFullName() != null) patient.setFullName(patientDto.getFullName());
            if (patientDto.getBed() != null) patient.setBed(patientDto.getBed());

            PatientBean updatedPatient = patientRepository.save(patient);
            return customResponse.getOkResponse(toDTO(updatedPatient));
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Delete a patient
    @Transactional
    public ResponseEntity<?> deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return customResponse.getOkResponse("Patient deleted successfully");
        } else {
            return customResponse.get400Response(404);
        }
    }

    @Transactional
    public ResponseEntity<?> assignPatientToBed(Long patientId, Long bedId) {
        Optional<PatientBean> optionalPatient = patientRepository.findById(patientId);
        if (optionalPatient.isEmpty()) {
            return customResponse.get400Response(404);
        }

        Optional<BedBean> optionalBed = bedRepository.findById(bedId);
        if (optionalBed.isEmpty()) {
            return customResponse.get400Response(404);
        }

        BedBean bed = optionalBed.get();

        if (bed.getPatient() != null) {
            return customResponse.getCustomResponse("Este paciente ya tiene una cama", "ERROR", HttpStatus.BAD_REQUEST);
        }

        PatientBean patient = optionalPatient.get();

        patient.setBed(bed);
        bed.setPatient(patient);

        patientRepository.save(patient);
        bedRepository.save(bed);

        return customResponse.getOkResponse("Paciente asignado a la cama correctamente");
    }


    // Convert from PatientBean to PatientDto
    private PatientDto toDTO(PatientBean patient) {
        return PatientDto.fromEntity(patient);
    }
}