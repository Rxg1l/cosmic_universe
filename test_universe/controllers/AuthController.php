<?php
require_once '../config/database.php';
require_once '../models/User.php';

class AuthController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function login($email, $password) {
        try {
            $this->user->email = $email;

            if ($this->user->emailExists()) {
                if ($this->user->verifyPassword($password)) {
                    if ($this->user->is_active) {
                        return [
                            'success' => true,
                            'user' => [
                                'id' => $this->user->id,
                                'name' => $this->user->first_name . ' ' . $this->user->last_name,
                                'email' => $email,
                                'role' => $this->user->role,
                                'avatar' => $this->user->avatar ?: $this->generateAvatar($this->user->first_name . ' ' . $this->user->last_name)
                            ]
                        ];
                    } else {
                        return [
                            'success' => false,
                            'message' => 'Account is deactivated'
                        ];
                    }
                } else {
                    return [
                        'success' => false,
                        'message' => 'Invalid password'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'message' => 'Email not found'
                ];
            }
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'System error: ' . $e->getMessage()
            ];
        }
    }

    public function register($userData) {
        try {
            // Check if email already exists
            $this->user->email = $userData['email'];
            if ($this->user->emailExists()) {
                return [
                    'success' => false,
                    'message' => 'Email already exists'
                ];
            }

            // Set user properties
            $this->user->first_name = $userData['firstName'];
            $this->user->last_name = $userData['lastName'];
            $this->user->email = $userData['email'];
            $this->user->username = $userData['username'];
            $this->user->password = $userData['password'];
            $this->user->role = $userData['userType'] ?? 'user';
            $this->user->avatar = $this->generateAvatar($userData['firstName'] . ' ' . $userData['lastName']);
            $this->user->is_active = 1;

            if ($this->user->create()) {
                return [
                    'success' => true,
                    'message' => 'User registered successfully',
                    'user' => [
                        'id' => $this->user->id,
                        'name' => $userData['firstName'] . ' ' . $userData['lastName'],
                        'email' => $userData['email'],
                        'role' => $this->user->role,
                        'avatar' => $this->user->avatar
                    ]
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to create user'
                ];
            }
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'System error: ' . $e->getMessage()
            ];
        }
    }

    private function generateAvatar($name) {
        return 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&background=00d4ff&color=fff';
    }

    public function demoLogin($email, $password) {
        // Demo accounts for testing
        $demoAccounts = [
            'admin@universe.com' => [
                'password' => 'admin123',
                'user' => [
                    'id' => 1,
                    'name' => 'Admin User',
                    'email' => 'admin@universe.com',
                    'role' => 'admin',
                    'avatar' => 'https://ui-avatars.com/api/?name=Admin+User&background=00d4ff&color=fff'
                ]
            ],
            'user@universe.com' => [
                'password' => 'user123', 
                'user' => [
                    'id' => 2,
                    'name' => 'Regular User',
                    'email' => 'user@universe.com',
                    'role' => 'user',
                    'avatar' => 'https://ui-avatars.com/api/?name=Regular+User&background=6f42c1&color=fff'
                ]
            ]
        ];

        if (isset($demoAccounts[$email]) && $demoAccounts[$email]['password'] === $password) {
            return [
                'success' => true,
                'user' => $demoAccounts[$email]['user']
            ];
        }

        return [
            'success' => false,
            'message' => 'Invalid demo credentials'
        ];
    }
}
?>