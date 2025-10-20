<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? '';

$authController = new AuthController();

try {
    switch ($action) {
        case 'login':
            if (!empty($input['email']) && !empty($input['password'])) {
                // For demo purposes, use demo login
                $result = $authController->demoLogin($input['email'], $input['password']);
                
                if ($result['success']) {
                    // Start session and store user data
                    session_start();
                    $_SESSION['user'] = $result['user'];
                    $_SESSION['logged_in'] = true;
                    
                    echo json_encode($result);
                } else {
                    http_response_code(401);
                    echo json_encode($result);
                }
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Email and password are required'
                ]);
            }
            break;

        case 'register':
            if (!empty($input['firstName']) && !empty($input['lastName']) && 
                !empty($input['email']) && !empty($input['password'])) {
                
                $result = $authController->register($input);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'All required fields must be filled'
                ]);
            }
            break;

        case 'logout':
            session_start();
            session_destroy();
            echo json_encode([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action'
            ]);
    }
} catch (Exception $e) {
    error_log("API Auth error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
}
?>