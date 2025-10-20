<?php
class CosmicObject {
    private $conn;
    private $table_name = "cosmic_objects";

    public $id;
    public $name;
    public $type;
    public $diameter_km;
    public $mass_kg;
    public $distance_from_earth_ly;
    public $constellation;
    public $description;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all cosmic objects with their facts
    public function readAll() {
        try {
            $query = "
                SELECT 
                    co.*,
                    GROUP_CONCAT(
                        CONCAT(
                            COALESCE(obj_facts.fact_description, ''), 
                            '|', 
                            COALESCE(obj_facts.discovery_year, 'Unknown'),
                            '|',
                            COALESCE(obj_facts.fact_type, 'Unknown'),
                            '|',
                            COALESCE(obj_facts.credibility_rating, 'Unknown')
                        ) 
                        SEPARATOR ';;'
                    ) as facts_data
                FROM " . $this->table_name . " co
                LEFT JOIN object_facts obj_facts ON co.id = obj_facts.cosmic_object_id
                GROUP BY co.id
                ORDER BY co.id
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return $stmt;
        } catch (PDOException $e) {
            throw new Exception("Query failed: " . $e->getMessage());
        }
    }

    // Create new cosmic object
    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . "
                    SET name=:name, type=:type, diameter_km=:diameter_km, 
                        mass_kg=:mass_kg, distance_from_earth_ly=:distance_from_earth_ly,
                        constellation=:constellation, description=:description";

            $stmt = $this->conn->prepare($query);

            // Sanitize input
            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->type = htmlspecialchars(strip_tags($this->type));
            $this->constellation = htmlspecialchars(strip_tags($this->constellation));
            $this->description = htmlspecialchars(strip_tags($this->description));

            // Bind parameters
            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":type", $this->type);
            $stmt->bindParam(":diameter_km", $this->diameter_km);
            $stmt->bindParam(":mass_kg", $this->mass_kg);
            $stmt->bindParam(":distance_from_earth_ly", $this->distance_from_earth_ly);
            $stmt->bindParam(":constellation", $this->constellation);
            $stmt->bindParam(":description", $this->description);

            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            throw new Exception("Create failed: " . $e->getMessage());
        }
    }

    // Delete cosmic object
    public function delete() {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->id);

            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            throw new Exception("Delete failed: " . $e->getMessage());
        }
    }
}
?>