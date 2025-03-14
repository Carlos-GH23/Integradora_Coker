package utez.edu.mx.integradora_coker.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.integradora_coker.models.Patient.PatientDto;
import utez.edu.mx.integradora_coker.models.Patient.PatientService;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin("*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // Get all patients
    @GetMapping
    public ResponseEntity<?> getAllPatients() {
        return patientService.getAllPatients();
    }

    // Get patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    // Create a patient
    @PostMapping("/create")
    public ResponseEntity<?> createPatient(@RequestBody PatientDto patientDto) {
        return patientService.createPatient(patientDto);
    }

    // Update a patient
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody PatientDto patientDto) {
        return patientService.updatePatient(id, patientDto);
    }

    // Delete a patient
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        return patientService.deletePatient(id);
    }
}