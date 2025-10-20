// Global variables
let cosmicData = [];
let filteredData = [];

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
    return (distance * 63241).toFixed(2) + " AU"; // Convert to Astronomical Units
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
    const response = await fetch("objects.php");
    const data = await response.json();

    if (data.success && data.data) {
      cosmicData = data.data;
      filteredData = [...cosmicData];
      displayCosmicObjects(filteredData);
      updateStatistics();
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

// Display cosmic objects in grid
function displayCosmicObjects(data) {
  const gridContainer = document.getElementById("cosmicObjectsGrid");
  gridContainer.innerHTML = "";

  if (data.length === 0) {
    gridContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-light">No objects found</h4>
                <p class="text-muted">Try adjusting your filters or search terms</p>
            </div>
        `;
    return;
  }

  data.forEach((object) => {
    const col = document.createElement("div");
    col.className = "col-xl-4 col-lg-6 col-md-6";

    // Format facts for display
    const factsHtml =
      object.facts && object.facts.length > 0
        ? object.facts
            .slice(0, 3)
            .map(
              (fact) => `
                <div class="fact-item">
                    <div class="fact-text">${fact.description}</div>
                    <div class="fact-meta">
                        Discovered: ${fact.discovery_year} | 
                        Type: ${fact.type} | 
                        Credibility: <span class="badge bg-${fact.credibility.toLowerCase()}">${
                fact.credibility
              }</span>
                    </div>
                </div>
            `
            )
            .join("")
        : '<div class="fact-item"><div class="fact-text">No facts available</div></div>';

    col.innerHTML = `
            <div class="object-card animate__animated animate__fadeIn">
                <div class="object-header">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="text-light mb-0">${object.name}</h5>
                        <span class="object-type type-${object.type
                          .toLowerCase()
                          .replace(" ", "-")}">
                            ${object.type}
                        </span>
                    </div>
                    ${
                      object.description
                        ? `<p class="text-muted small mb-0">${object.description}</p>`
                        : ""
                    }
                </div>
                
                <div class="object-body">
                    <div class="object-stats">
                        <div class="stat-item">
                            <span class="stat-value">${formatNumber(
                              object.diameter_km
                            )}</span>
                            <span class="stat-label">Diameter</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${formatMass(
                              object.mass_kg
                            )}</span>
                            <span class="stat-label">Mass</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${formatDistance(
                              object.distance_from_earth_ly
                            )}</span>
                            <span class="stat-label">Distance</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${
                              object.constellation || "N/A"
                            }</span>
                            <span class="stat-label">Constellation</span>
                        </div>
                    </div>
                    
                    <div class="object-facts">
                        ${factsHtml}
                    </div>
                </div>
                
                <div class="object-actions">
                    <button class="btn btn-action btn-view" onclick="viewObjectDetails(${
                      object.id
                    })">
                        <i class="fas fa-eye me-1"></i>View Details
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteObject(${
                      object.id
                    })">
                        <i class="fas fa-trash me-1"></i>Delete
                    </button>
                </div>
            </div>
        `;
    gridContainer.appendChild(col);
  });
}

// Update statistics
function updateStatistics() {
  const planetCount = cosmicData.filter((obj) => obj.type === "Planet").length;
  const starCount = cosmicData.filter((obj) => obj.type === "Star").length;
  const galaxyCount = cosmicData.filter((obj) => obj.type === "Galaxy").length;
  const totalCount = cosmicData.length;

  document.getElementById("planetCount").textContent = planetCount;
  document.getElementById("starCount").textContent = starCount;
  document.getElementById("galaxyCount").textContent = galaxyCount;
  document.getElementById("totalCount").textContent = totalCount;
  document.getElementById("objectCount").textContent = totalCount;
}

// Filter objects
function filterObjects() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const typeFilter = document.getElementById("typeFilter").value;
  const credibilityFilter = document.getElementById("credibilityFilter").value;

  filteredData = cosmicData.filter((object) => {
    const matchesSearch =
      object.name.toLowerCase().includes(searchTerm) ||
      (object.description &&
        object.description.toLowerCase().includes(searchTerm)) ||
      (object.constellation &&
        object.constellation.toLowerCase().includes(searchTerm));

    const matchesType = !typeFilter || object.type === typeFilter;

    const matchesCredibility =
      !credibilityFilter ||
      (object.facts &&
        object.facts.some((fact) => fact.credibility === credibilityFilter));

    return matchesSearch && matchesType && matchesCredibility;
  });

  displayCosmicObjects(filteredData);
}

// Reset filters
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "";
  document.getElementById("credibilityFilter").value = "";
  filteredData = [...cosmicData];
  displayCosmicObjects(filteredData);
}

// View object details
function viewObjectDetails(id) {
  const object = cosmicData.find((obj) => obj.id === id);
  if (!object) return;

  const factsHtml =
    object.facts && object.facts.length > 0
      ? object.facts
          .map(
            (fact) => `
            <div class="fact-item mb-2">
                <div class="fact-text">${fact.description}</div>
                <div class="fact-meta">
                    Discovered: ${fact.discovery_year} | 
                    Type: ${fact.type} | 
                    Credibility: <span class="badge bg-${fact.credibility.toLowerCase()}">${
              fact.credibility
            }</span>
                </div>
            </div>
        `
          )
          .join("")
      : '<p class="text-muted">No facts available</p>';

  document.getElementById("detailsModalTitle").innerHTML = `
        <i class="fas fa-info-circle me-2"></i>${object.name} Details
    `;

  document.getElementById("objectDetailsContent").innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Basic Information</h6>
                <table class="table table-dark table-sm">
                    <tr><td>Type:</td><td><span class="object-type type-${object.type
                      .toLowerCase()
                      .replace(" ", "-")}">${object.type}</span></td></tr>
                    <tr><td>Diameter:</td><td>${formatNumber(
                      object.diameter_km
                    )} km</td></tr>
                    <tr><td>Mass:</td><td>${formatMass(
                      object.mass_kg
                    )}</td></tr>
                    <tr><td>Distance:</td><td>${formatDistance(
                      object.distance_from_earth_ly
                    )}</td></tr>
                    <tr><td>Constellation:</td><td>${
                      object.constellation || "N/A"
                    }</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Description</h6>
                <p class="text-light">${
                  object.description || "No description available."
                }</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6>Facts & Information</h6>
                <div class="object-facts">
                    ${factsHtml}
                </div>
            </div>
        </div>
    `;

  const modal = new bootstrap.Modal(
    document.getElementById("objectDetailsModal")
  );
  modal.show();
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
    alert("Please fill in required fields: Name and Type");
    return;
  }

  try {
    const response = await fetch("add_object.php", {
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
      showTemporaryMessage("Object added successfully!", "success");
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    showTemporaryMessage("Failed to add object: " + error.message, "error");
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
    const response = await fetch("delete_object.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    const result = await response.json();

    if (result.success) {
      await loadCosmicObjects();
      showTemporaryMessage("Object deleted successfully!", "success");
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    showTemporaryMessage("Failed to delete object: " + error.message, "error");
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

function showTemporaryMessage(message, type) {
  const alertClass = type === "success" ? "alert-success" : "alert-danger";
  const alert = document.createElement("div");
  alert.className = `alert ${alertClass} cosmic-alert position-fixed`;
  alert.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
  alert.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check" : "exclamation"
        }-circle me-2"></i>
        ${message}
    `;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadCosmicObjects();

  // Add event listeners for filters
  document
    .getElementById("searchInput")
    .addEventListener("input", filterObjects);
  document
    .getElementById("typeFilter")
    .addEventListener("change", filterObjects);
  document
    .getElementById("credibilityFilter")
    .addEventListener("change", filterObjects);

  // Add keyboard shortcut
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      loadCosmicObjects();
    }
  });
});
