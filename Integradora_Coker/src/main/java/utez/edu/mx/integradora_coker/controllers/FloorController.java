package utez.edu.mx.integradora_coker.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.integradora_coker.models.floor.FloorDto;
import utez.edu.mx.integradora_coker.models.floor.FloorService;


@RestController
@RequestMapping("/api/floors")
@CrossOrigin("*")
public class FloorController {

    @Autowired
    private FloorService floorService;

    // Get all floors
    @GetMapping
    public ResponseEntity<?> getAllFloors() {
        return floorService.getAllFloors();
    }

    // Get floor by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFloorById(@PathVariable Long id) {
        return floorService.getFloorById(id);
    }

    // Create a floor
    @PostMapping("/create")
    public ResponseEntity<?> createFloor(@RequestBody FloorDto floorDto) {
        return floorService.createFloor(floorDto);
    }

    // Update a floor
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateFloor(@PathVariable Long id, @RequestBody FloorDto floorDto) {
        return floorService.updateFloor(id, floorDto);
    }

    // Delete a floor
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFloor(@PathVariable Long id) {
        return floorService.deleteFloor(id);
    }
}