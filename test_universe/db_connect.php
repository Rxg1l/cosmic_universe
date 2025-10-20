<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Database connection is null");
    }
    
    // Test connection
    $test = $db->query("SELECT 1")->fetch();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Connection test failed: " . $e->getMessage()
    ]);
    exit;
}
?>