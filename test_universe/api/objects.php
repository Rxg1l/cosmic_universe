<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../controllers/CosmicObjectController.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

// Check authentication for POST and DELETE methods
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Access denied. Admin privileges required.'
        ]);
        exit;
    }
}

$controller = new CosmicObjectController();

try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $result = $controller->getAllObjects();
            echo json_encode($result, JSON_PRETTY_PRINT);
            break;

        case 'POST':
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!empty($input['name']) && !empty($input['type'])) {
                $result = $controller->createObject($input);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name and type are required'
                ]);
            }
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents("php://input"), true);
            
            if (!empty($input['id'])) {
                $result = $controller->deleteObject($input['id']);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Object ID is required'
                ]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ]);
    }
} catch (Exception $e) {
    error_log("API Objects error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>