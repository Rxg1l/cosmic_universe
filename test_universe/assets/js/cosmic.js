// Cosmic Objects JavaScript
let cosmicData = [];

// Format number with commas
function formatNumber(num) {
  if (!num || isNaN(num)) return "N/A";
  return new Intl.NumberFormat("id-ID").format(num);
}

// Format mass for better readability
function formatMass(mass) {
  if (!mass || isNaN(mass)) return "N/A";

  if (mass >= 1e42) {
    return (mass / 1e42).toFixed(2) + " × 10⁴² kg";
  } else if (mass >= 1e30) {
    return (mass / 1e30).toFixed(2) + " × 10³⁰ kg";
  } else if (mass >= 1e27) {
    return (mass / 1e27).toFixed(2) + " × 10²⁷ kg";
  } else if (mass >= 1e24) {
    return (mass / 1e24).toFixed(2) + " × 10²⁴ kg";
  } else if (mass >= 1e22) {
    return (mass / 1e22).toFixed(2) + " × 10²² kg";
  } else {
    return formatNumber(mass) + " kg";
  }
}

// Format distance
function formatDistance(distance) {
  if (!distance || isNaN(distance)) return "N/A";

  if (distance >= 1000000) {
    return (distance / 1000000).toFixed(2) + "M ly";
  } else if (distance >= 1000) {
    return (distance / 1000).toFixed(2) + "K ly";
  } else if (distance < 0.001) {
    return (distance * 63241).toFixed(2) + " AU";
  } else {
    return distance + " ly";
  }
}

// Load cosmic objects data
async function loadCosmicObjects() {
  showLoading(true);
  hideError();
  showDataContainer(false);

  try {
    const response = await fetch("api/objects.php");
    const data = await response.json();

    if (data.success && data.data) {
      cosmicData = data.data;
      displayCosmicObjects(cosmicData);
      showDataContainer(true);
    } else {
      throw new Error(data.message || "Failed to load data");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to load data: " + error.message);
    showDataContainer(false);
  } finally {
    showLoading(false);
  }
}

// Display cosmic objects in table
function displayCosmicObjects(data) {
  const tableBody = document.getElementById("cosmicObjectsTable");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="${
                  document.querySelector("th").parentElement.cells.length
                }" class="text-center py-4">
                    <i class="fas fa-search fa-2x text-muted mb-3"></i>
                    <h5 class="text-light">No cosmic objects found</h5>
                    <p class="text-muted">No data available in the database</p>
                </td>
            </tr>
        `;
    return;
  }

  data.forEach((object) => {
    const row = document.createElement("tr");
    row.className = "animate__animated animate__fadeIn";

    // Format facts for display
    const factsList =
      object.facts && object.facts.length > 0
        ? object.facts
            .slice(0, 2)
            .map(
              (fact) =>
                `<li class="fact-item">
                    <strong>${fact.description}</strong>
                    <br><small class="text-muted">
                        Discovered: ${fact.discovery_year} | 
                        Type: ${fact.type} | 
                        Credibility: <span class="badge bg-${getCredibilityColor(
                          fact.credibility
                        )}">${fact.credibility}</span>
                    </small>
                </li>`
            )
            .join("")
        : '<li class="text-muted">No facts available</li>';

    const isAdmin =
      document.querySelector(
        '.btn-primary[data-bs-target="#addObjectModal"]'
      ) !== null;

    row.innerHTML = `
            <td>${object.id}</td>
            <td>
                <strong>${object.name}</strong>
                ${
                  object.description
                    ? `<br><small class="text-muted">${object.description}</small>`
                    : ""
                }
            </td>
            <td><span class="badge ${getTypeBadgeClass(object.type)}">${
      object.type
    }</span></td>
            <td>${formatNumber(object.diameter_km)}</td>
            <td>${formatMass(object.mass_kg)}</td>
            <td>${formatDistance(object.distance_from_earth_ly)}</td>
            <td>${object.constellation || "N/A"}</td>
            <td><ul class="facts-list">${factsList}</ul></td>
            ${
              isAdmin
                ? `
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-warning" onclick="editObject(${object.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteObject(${object.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
            `
                : ""
            }
        `;
    tableBody.appendChild(row);
  });
}

// Get badge color based on type
function getTypeBadgeClass(type) {
  const typeColors = {
    Planet: "bg-success",
    Star: "bg-warning",
    Moon: "bg-info",
    Galaxy: "bg-primary",
    Nebula: "bg-purple",
    "Black Hole": "bg-dark",
  };
  return typeColors[type] || "bg-secondary";
}

// Get credibility color
function getCredibilityColor(credibility) {
  const credibilityColors = {
    High: "success",
    Medium: "warning",
    Low: "danger",
  };
  return credibilityColors[credibility] || "secondary";
}

// Add new cosmic object
async function addCosmicObject() {
  const form = document.getElementById("addObjectForm");
  const formData = new FormData(form);

  const objectData = {
    name: formData.get("name"),
    type: formData.get("type"),
    diameter_km: formData.get("diameter_km")
      ? parseFloat(formData.get("diameter_km"))
      : null,
    mass_kg: formData.get("mass_kg")
      ? parseFloat(formData.get("mass_kg"))
      : null,
    distance_from_earth_ly: formData.get("distance_from_earth_ly")
      ? parseFloat(formData.get("distance_from_earth_ly"))
      : null,
    constellation: formData.get("constellation") || null,
    description: formData.get("description") || null,
  };

  // Basic validation
  if (!objectData.name || !objectData.type) {
    showAlert("Please fill in required fields: Name and Type", "error");
    return;
  }

  try {
    const response = await fetch("api/objects.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectData),
    });

    const result = await response.json();

    if (result.success) {
      // Close modal and reset form
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("addObjectModal")
      );
      modal.hide();
      form.reset();

      // Reload data
      await loadCosmicObjects();

      // Show success message
      showAlert("Cosmic object added successfully!", "success");
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Failed to add object: " + error.message, "error");
  }
}

// Delete cosmic object
async function deleteObject(id) {
  const object = cosmicData.find((obj) => obj.id === id);
  if (!object) return;

  if (
    !confirm(
      `Are you sure you want to delete "${object.name}"? This action cannot be undone.`
    )
  ) {
    return;
  }

  try {
    const response = await fetch("api/objects.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    const result = await response.json();

    if (result.success) {
      await loadCosmicObjects();
      showAlert("Cosmic object deleted successfully!", "success");
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Failed to delete object: " + error.message, "error");
  }
}

// Edit cosmic object (placeholder)
function editObject(id) {
  const object = cosmicData.find((obj) => obj.id === id);
  if (object) {
    alert(`Edit functionality for "${object.name}" will be implemented soon!`);
  }
}

// UI control functions
function showLoading(show) {
  document.getElementById("loading").style.display = show ? "block" : "none";
}

function showDataContainer(show) {
  document.getElementById("dataContainer").style.display = show
    ? "block"
    : "none";
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  errorText.textContent = message;
  errorDiv.style.display = "block";
}

function hideError() {
  document.getElementById("errorMessage").style.display = "none";
}

function showAlert(message, type) {
  // Remove existing alerts
  const existingAlert = document.querySelector(".alert-toast");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create alert element
  const alert = document.createElement("div");
  alert.className = `alert-toast alert-${type}`;
  alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            } me-2"></i>
            ${message}
        </div>
    `;

  // Add styles
  alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#198754" : "#dc3545"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;

  document.body.appendChild(alert);

  // Remove alert after 5 seconds
  setTimeout(() => {
    alert.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .facts-list {
        padding-left: 0;
        margin-bottom: 0;
        max-height: 120px;
        overflow-y: auto;
    }
    
    .fact-item {
        background: rgba(255, 255, 255, 0.05);
        border-left: 3px solid var(--accent-color, #00d4ff);
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 0 4px 4px 0;
        font-size: 0.875rem;
    }
    
    .fact-item:last-child {
        margin-bottom: 0;
    }
    
    .cosmic-table th {
        background: linear-gradient(135deg, #1a1f2e, #2d1b69) !important;
    }
    
    .bg-purple {
        background-color: #6f42c1 !important;
    }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadCosmicObjects();
});
