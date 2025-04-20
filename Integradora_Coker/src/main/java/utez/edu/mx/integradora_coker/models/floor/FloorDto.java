package utez.edu.mx.integradora_coker.models.floor;

public class FloorDto {
    private Long id;
    private String identifier;
    private int bednumber;

    // Getters and Setters
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

    public int getBednumber() {return bednumber;}

    public void setBednumber(int bednumber) {this.bednumber = bednumber;}

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