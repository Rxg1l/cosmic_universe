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

    if(empty($data['id'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing object ID"
        ]);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();

    $cosmicObject = new CosmicObject($db);
    $cosmicObject->id = $data['id'];

    if($cosmicObject->delete()) {
        echo json_encode([
            "success" => true,
            "message" => "Cosmic object deleted successfully"
        ]);
    } else {
        throw new Exception("Unable to delete cosmic object");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>