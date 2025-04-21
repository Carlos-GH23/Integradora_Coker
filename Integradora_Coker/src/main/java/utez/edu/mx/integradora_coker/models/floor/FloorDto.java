package utez.edu.mx.integradora_coker.models.floor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class FloorDto {
    private Long id;

    @NotBlank(message = "El identificador no puede estar vacío")
    @Size(max = 20, message = "El identificador no puede exceder los 20 caracteres")
    @Pattern(
            regexp = "^[A-Za-z0-9\\-\\_\\s]+$",
            message = "El identificador solo puede contener letras, números, guiones y espacios"
    )
    private String identifier;

    @Min(value = 1, message = "El número de camas debe ser al menos 1")
    private int bednumber;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public int getBednumber() {
        return bednumber;
    }

    public void setBednumber(int bednumber) {
        this.bednumber = bednumber;
    }

    // Convert from FloorBean to FloorDto
    public static FloorDto fromEntity(FloorBean floor) {
        FloorDto dto = new FloorDto();
        dto.setId(floor.getId());
        dto.setIdentifier(floor.getIdentifier());
        dto.setBednumber(floor.getBednumber());
        return dto;
    }

    // Convert from FloorDto to FloorBean
    public FloorBean toEntity() {
        FloorBean floor = new FloorBean();
        floor.setId(this.id);
        floor.setIdentifier(this.identifier);
        floor.setBednumber(this.bednumber);
        return floor;
    }
}
