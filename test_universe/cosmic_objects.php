<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    header('Location: login.html');
    exit;
}

$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cosmic Objects - Universe Explorer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>

<body class="cosmic-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark cosmic-nav">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.html">
                <i class="fas fa-rocket me-2"></i>
                <strong>Universe Explorer</strong>
            </a>

            <div class="navbar-nav ms-auto">
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <img src="<?php echo $user['avatar']; ?>" alt="User" class="user-avatar-sm">
                        <?php echo $user['name']; ?>
                    </a>
                    <ul class="dropdown-menu">
                        <?php if ($user['role'] === 'admin'): ?>
                        <li><a class="dropdown-item" href="admin/dashboard.html"><i
                                    class="fas fa-tachometer-alt me-2"></i>Admin Dashboard</a></li>
                        <?php else: ?>
                        <li><a class="dropdown-item" href="user/dashboard.html"><i
                                    class="fas fa-tachometer-alt me-2"></i>User Dashboard</a></li>
                        <?php endif; ?>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Profile</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="api/auth.php?action=logout"><i
                                    class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container-fluid mt-4">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1><i class="fas fa-stars me-2"></i>Cosmic Objects Database</h1>
                    <?php if ($user['role'] === 'admin'): ?>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addObjectModal">
                        <i class="fas fa-plus me-2"></i>Add New Object
                    </button>
                    <?php endif; ?>
                </div>

                <!-- Loading Spinner -->
                <div id="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">Exploring the universe...</p>
                </div>

                <!-- Data Container -->
                <div id="dataContainer" style="display: none;">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover cosmic-table">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nama</th>
                                    <th>Tipe</th>
                                    <th>Diameter (km)</th>
                                    <th>Massa (kg)</th>
                                    <th>Jarak dari Bumi</th>
                                    <th>Rasi Bintang</th>
                                    <th>Fakta</th>
                                    <?php if ($user['role'] === 'admin'): ?>
                                    <th>Aksi</th>
                                    <?php endif; ?>
                                </tr>
                            </thead>
                            <tbody id="cosmicObjectsTable">
                                <!-- Data akan diisi oleh JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Error Message -->
                <div id="errorMessage" class="alert alert-danger mt-4" style="display: none;">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <span id="errorText"></span>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Object Modal (Hanya untuk Admin) -->
    <?php if ($user['role'] === 'admin'): ?>
    <div class="modal fade" id="addObjectModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content cosmic-modal">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-plus me-2"></i>Add New Cosmic Object</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addObjectForm">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Object Name *</label>
                                    <input type="text" class="form-control cosmic-input" name="name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Type *</label>
                                    <select class="form-select cosmic-select" name="type" required>
                                        <option value="">Select Type</option>
                                        <option value="Planet">Planet</option>
                                        <option value="Star">Star</option>
                                        <option value="Moon">Moon</option>
                                        <option value="Galaxy">Galaxy</option>
                                        <option value="Nebula">Nebula</option>
                                        <option value="Black Hole">Black Hole</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Diameter (km)</label>
                                    <input type="number" step="0.01" class="form-control cosmic-input"
                                        name="diameter_km">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Mass (kg)</label>
                                    <input type="number" step="0.01" class="form-control cosmic-input" name="mass_kg">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Distance from Earth (light years)</label>
                                    <input type="number" step="0.01" class="form-control cosmic-input"
                                        name="distance_from_earth_ly">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Constellation</label>
                                    <input type="text" class="form-control cosmic-input" name="constellation">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control cosmic-input" name="description" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="addCosmicObject()">
                        <i class="fas fa-save me-2"></i>Save Object
                    </button>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/cosmic.js"></script>
</body>

</html>