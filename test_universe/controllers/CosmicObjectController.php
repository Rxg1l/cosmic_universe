<?php
require_once '../config/database.php';
require_once '../models/CosmicObject.php';

class CosmicObjectController {
    private $db;
    private $cosmicObject;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->cosmicObject = new CosmicObject($this->db);
    }

    public function getAllObjects() {
        try {
            $stmt = $this->cosmicObject->readAll();
            $objects = [];
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $objects[] = $this->formatObjectData($row);
            }
            
            return [
                'success' => true,
                'data' => $objects,
                'total' => count($objects)
            ];
        } catch (Exception $e) {
            error_log("Get all objects error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to fetch objects: ' . $e->getMessage()
            ];
        }
    }

    public function createObject($objectData) {
        try {
            $this->cosmicObject->name = $objectData['name'];
            $this->cosmicObject->type = $objectData['type'];
            $this->cosmicObject->diameter_km = $objectData['diameter_km'] ?? null;
            $this->cosmicObject->mass_kg = $objectData['mass_kg'] ?? null;
            $this->cosmicObject->distance_from_earth_ly = $objectData['distance_from_earth_ly'] ?? null;
            $this->cosmicObject->constellation = $objectData['constellation'] ?? null;
            $this->cosmicObject->description = $objectData['description'] ?? null;

            $objectId = $this->cosmicObject->create();
            
            if ($objectId) {
                return [
                    'success' => true,
                    'message' => 'Cosmic object created successfully',
                    'id' => $objectId
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to create cosmic object'
                ];
            }
        } catch (Exception $e) {
            error_log("Create object error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to create object: ' . $e->getMessage()
            ];
        }
    }

    public function deleteObject($id) {
        try {
            $this->cosmicObject->id = $id;
            
            if ($this->cosmicObject->delete()) {
                return [
                    'success' => true,
                    'message' => 'Cosmic object deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to delete cosmic object'
                ];
            }
        } catch (Exception $e) {
            error_log("Delete object error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to delete object: ' . $e->getMessage()
            ];
        }
    }

    private function formatObjectData($row) {
        $facts_array = [];
        if(!empty($row['facts_data']) && $row['facts_data'] !== null) {
            $facts = explode(';;', $row['facts_data']);
            foreach($facts as $fact) {
                if (!empty(trim($fact))) {
                    $fact_parts = explode('|', $fact);
                    if(count($fact_parts) >= 4) {
                        $facts_array[] = [
                            "description" => $fact_parts[0],
                            "discovery_year" => $fact_parts[1],
                            "type" => $fact_parts[2],
                            "credibility" => $fact_parts[3]
                        ];
                    }
                }
            }
        }

        return [
            "id" => $row['id'],
            "name" => $row['name'],
            "type" => $row['type'],
            "diameter_km" => $row['diameter_km'],
            "mass_kg" => $row['mass_kg'],
            "distance_from_earth_ly" => $row['distance_from_earth_ly'],
            "constellation" => $row['constellation'],
            "description" => $row['description'],
            "facts" => $facts_array,
            "created_at" => $row['created_at']
        ];
    }
}
?>