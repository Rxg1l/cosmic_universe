<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    include_once 'config/database.php';
    include_once 'models/CosmicObject.php';

    // Get raw POST data
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data");
    }

    if(empty($data['name']) || empty($data['type'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields: name and type"
        ]);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();

    $cosmicObject = new CosmicObject($db);

    $cosmicObject->name = $data['name'];
    $cosmicObject->type = $data['type'];
    $cosmicObject->diameter_km = $data['diameter_km'] ?? null;
    $cosmicObject->mass_kg = $data['mass_kg'] ?? null;
    $cosmicObject->distance_from_earth_ly = $data['distance_from_earth_ly'] ?? null;
    $cosmicObject->constellation = $data['constellation'] ?? null;
    $cosmicObject->description = $data['description'] ?? null;

    if($cosmicObject->create()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Cosmic object created successfully",
            "id" => $db->lastInsertId()
        ]);
    } else {
        throw new Exception("Unable to create cosmic object");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>