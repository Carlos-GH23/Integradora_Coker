package utez.edu.mx.integradora_coker.models.floor;

public class FloorDto {
    private Long id;
    private String identifier;
    private int bednumber;
    private int occupied;

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

    public int getOccupied() {return occupied;}

    public void setOccupied(int occupied) {this.occupied = occupied;}

    // Convert from FloorBean to FloorDto
    public static FloorDto fromEntity(FloorBean floor) {
        FloorDto dto = new FloorDto();
        dto.setId(floor.getId());
        dto.setIdentifier(floor.getIdentifier());
        dto.setBednumber(floor.getBednumber());
        dto.setOccupied(floor.isOccupied()?1:0);
        return dto;
    }

    // Convert from FloorDto to FloorBean
    public FloorBean toEntity() {
        FloorBean floor = new FloorBean();
        floor.setId(this.id);
        floor.setIdentifier(this.identifier);
        floor.setBednumber(this.bednumber);
        floor.setOccupied(this.occupied == 1);
        return floor;
    }
}