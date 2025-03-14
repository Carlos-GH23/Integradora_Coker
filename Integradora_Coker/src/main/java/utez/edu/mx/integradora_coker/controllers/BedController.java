package utez.edu.mx.integradora_coker.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.integradora_coker.models.Bed.BedDto;
import utez.edu.mx.integradora_coker.models.Bed.BedService;


@RestController
@RequestMapping("/api/beds")
@CrossOrigin("*")
public class BedController {

    @Autowired
    private BedService bedService;

    // Get all beds
    @GetMapping
    public ResponseEntity<?> getAllBeds() {
        return bedService.getAllBeds();
    }

    // Get bed by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBedById(@PathVariable Long id) {
        return bedService.getBedById(id);
    }

    // Create a bed
    @PostMapping("/create")
    public ResponseEntity<?> createBed(@RequestBody BedDto bedDto) {
        return bedService.createBed(bedDto);
    }

    // Update a bed
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateBed(@PathVariable Long id, @RequestBody BedDto bedDto) {
        return bedService.updateBed(id, bedDto);
    }

    // Delete a bed
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBed(@PathVariable Long id) {
        return bedService.deleteBed(id);
    }
}