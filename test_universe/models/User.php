<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $username;
    public $password;
    public $role;
    public $avatar;
    public $is_active;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new user
    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . "
                     SET first_name=:first_name, last_name=:last_name, email=:email, 
                         username=:username, password=:password, role=:role, 
                         avatar=:avatar, is_active=:is_active";

            $stmt = $this->conn->prepare($query);

            // Sanitize input
            $this->first_name = htmlspecialchars(strip_tags($this->first_name));
            $this->last_name = htmlspecialchars(strip_tags($this->last_name));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->username = htmlspecialchars(strip_tags($this->username));

            // Hash password
            $this->password = password_hash($this->password, PASSWORD_DEFAULT);

            // Bind parameters
            $stmt->bindParam(":first_name", $this->first_name);
            $stmt->bindParam(":last_name", $this->last_name);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":password", $this->password);
            $stmt->bindParam(":role", $this->role);
            $stmt->bindParam(":avatar", $this->avatar);
            $stmt->bindParam(":is_active", $this->is_active);

            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("User creation error: " . $e->getMessage());
            return false;
        }
    }

    // Check if email exists
    public function emailExists() {
        $query = "SELECT id, first_name, last_name, password, role, avatar, is_active
                 FROM " . $this->table_name . "
                 WHERE email = :email
                 LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            $this->id = $row['id'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->avatar = $row['avatar'];
            $this->is_active = $row['is_active'];
            return true;
        }
        return false;
    }

    // Verify password
    public function verifyPassword($password) {
        return password_verify($password, $this->password);
    }

    // Get user by ID
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        return false;
    }
}
?>