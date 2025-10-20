<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    include_once 'config/database.php';
    include_once 'models/CosmicObject.php';

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception("Unable to establish database connection");
    }

    $cosmicObject = new CosmicObject($db);
    $stmt = $cosmicObject->readAll();
    
    if (!$stmt) {
        throw new Exception("Failed to execute query");
    }
    
    $num = $stmt->rowCount();

    $cosmic_objects_arr = array();
    $cosmic_objects_arr["data"] = array();

    if($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Extract row to variables
            $id = $row['id'];
            $name = $row['name'];
            $type = $row['type'];
            $diameter_km = $row['diameter_km'];
            $mass_kg = $row['mass_kg'];
            $distance_from_earth_ly = $row['distance_from_earth_ly'];
            $constellation = $row['constellation'];
            $description = $row['description'];
            $created_at = $row['created_at'];
            $facts_data = $row['facts_data'];

            $facts_array = array();
            if(!empty($facts_data) && $facts_data !== null) {
                $facts = explode(';;', $facts_data);
                foreach($facts as $fact) {
                    if (!empty(trim($fact))) {
                        $fact_parts = explode('|', $fact);
                        if(count($fact_parts) >= 4) {
                            $facts_array[] = array(
                                "description" => $fact_parts[0],
                                "discovery_year" => $fact_parts[1],
                                "type" => $fact_parts[2],
                                "credibility" => $fact_parts[3]
                            );
                        }
                    }
                }
            }

            $cosmic_object_item = array(
                "id" => $id,
                "name" => $name,
                "type" => $type,
                "diameter_km" => $diameter_km,
                "mass_kg" => $mass_kg,
                "distance_from_earth_ly" => $distance_from_earth_ly,
                "constellation" => $constellation,
                "description" => $description,
                "facts" => $facts_array,
                "created_at" => $created_at
            );

            array_push($cosmic_objects_arr["data"], $cosmic_object_item);
        }

        $cosmic_objects_arr["success"] = true;
        $cosmic_objects_arr["message"] = "Data retrieved successfully";
        $cosmic_objects_arr["total"] = $num;
    } else {
        $cosmic_objects_arr["success"] = true;
        $cosmic_objects_arr["message"] = "No data found";
        $cosmic_objects_arr["total"] = 0;
        $cosmic_objects_arr["data"] = [];
    }

    echo json_encode($cosmic_objects_arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    $error_response = [
        "success" => false,
        "message" => "Error: " . $e->getMessage(),
        "data" => []
    ];
    echo json_encode($error_response, JSON_PRETTY_PRINT);
    exit;
}
?>