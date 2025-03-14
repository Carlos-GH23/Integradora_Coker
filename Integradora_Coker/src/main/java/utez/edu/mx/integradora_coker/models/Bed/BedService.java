package utez.edu.mx.integradora_coker.models.Bed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.integradora_coker.kernel.CustomResponse;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BedService {

    @Autowired
    private BedRepository bedRepository;

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
    @Transactional
    public ResponseEntity<?> createBed(BedDto bedDto) {
        BedBean bed = bedDto.toEntity();
        BedBean savedBed = bedRepository.save(bed);
        return customResponse.getCreatedResponse("Bed created successfully");
    }

    // Update a bed
    @Transactional
    public ResponseEntity<?> updateBed(Long id, BedDto bedDto) {
        Optional<BedBean> existingBed = bedRepository.findById(id);
        if (existingBed.isPresent()) {
            BedBean bed = existingBed.get();

            // Update only if values are not null
            if (bedDto.getIdentifier() != null) bed.setIdentifier(bedDto.getIdentifier());
            if (bedDto.getFloor() != null) bed.setFloor(bedDto.getFloor());
            if (bedDto.getUser() != null) bed.setUser(bedDto.getUser());
            if (bedDto.getPatient() != null) bed.setPatient(bedDto.getPatient());

            BedBean updatedBed = bedRepository.save(bed);
            return customResponse.getOkResponse(toDTO(updatedBed));
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Delete a bed
    @Transactional
    public ResponseEntity<?> deleteBed(Long id) {
        if (bedRepository.existsById(id)) {
            bedRepository.deleteById(id);
            return customResponse.getOkResponse("Bed deleted successfully");
        } else {
            return customResponse.get400Response(404);
        }
    }

    // Convert from BedBean to BedDto
    private BedDto toDTO(BedBean bed) {
        return BedDto.fromEntity(bed);
    }
}