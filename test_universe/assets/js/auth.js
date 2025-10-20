// Authentication JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Password visibility toggle
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const passwordInput = document.getElementById(targetId);
      const icon = this.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });

  // Login Form Handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleLogin();
    });
  }

  // Register Form Handler
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleRegister();
    });

    // Password strength indicator
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      passwordInput.addEventListener("input", checkPasswordStrength);
    }

    // Confirm password validation
    const confirmPasswordInput = document.getElementById("confirmPassword");
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", validatePasswordMatch);
    }
  }
});

// Handle Login
async function handleLogin() {
  const form = document.getElementById("loginForm");
  const formData = new FormData(form);

  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
    remember: document.getElementById("rememberMe").checked,
  };

  // Basic validation
  if (!loginData.email || !loginData.password) {
    showAlert("Please fill in all fields", "error");
    return;
  }

  // Show loading state
  const submitBtn = form.querySelector(".auth-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i>Signing In...';
  submitBtn.disabled = true;

  try {
    // Simulate API call - replace with actual API endpoint
    const response = await simulateLogin(loginData);

    if (response.success) {
      showAlert("Login successful! Redirecting...", "success");

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      // Redirect based on user role
      setTimeout(() => {
        if (response.user.role === "admin") {
          window.location.href = "admin/dashboard.html";
        } else {
          window.location.href = "user/dashboard.html";
        }
      }, 2000);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    showAlert(error.message, "error");
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Handle Register
async function handleRegister() {
  const form = document.getElementById("registerForm");
  const formData = new FormData(form);

  const registerData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    userType: formData.get("userType"),
    agreeTerms: document.getElementById("terms").checked,
  };

  // Validation
  if (!validateRegisterForm(registerData)) {
    return;
  }

  // Show loading state
  const submitBtn = form.querySelector(".auth-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
  submitBtn.disabled = true;

  try {
    // Simulate API call - replace with actual API endpoint
    const response = await simulateRegister(registerData);

    if (response.success) {
      showAlert(
        "Account created successfully! Redirecting to login...",
        "success"
      );

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Registration error:", error);
    showAlert(error.message, "error");
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Form Validation
function validateRegisterForm(data) {
  // Check required fields
  if (
    !data.firstName ||
    !data.lastName ||
    !data.email ||
    !data.username ||
    !data.password ||
    !data.userType
  ) {
    showAlert("Please fill in all required fields", "error");
    return false;
  }

  // Check terms agreement
  if (!data.agreeTerms) {
    showAlert("Please agree to the terms and conditions", "error");
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showAlert("Please enter a valid email address", "error");
    return false;
  }

  // Password match validation
  if (data.password !== data.confirmPassword) {
    showAlert("Passwords do not match", "error");
    return false;
  }

  // Password strength validation
  if (data.password.length < 8) {
    showAlert("Password must be at least 8 characters long", "error");
    return false;
  }

  return true;
}

// Password Strength Checker
function checkPasswordStrength() {
  const password = document.getElementById("password").value;
  const strengthBar = document.querySelector(".strength-fill");
  const strengthText = document.querySelector(".strength-text");

  if (!strengthBar) return;

  let strength = 0;
  let text = "";
  let color = "";

  // Check password length
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // Check for character variety
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  // Determine strength level
  if (password.length === 0) {
    text = "";
    color = "transparent";
  } else if (strength <= 2) {
    text = "Weak";
    color = "#dc3545";
    strengthBar.className = "strength-fill strength-weak";
  } else if (strength <= 4) {
    text = "Medium";
    color = "#ffc107";
    strengthBar.className = "strength-fill strength-medium";
  } else {
    text = "Strong";
    color = "#198754";
    strengthBar.className = "strength-fill strength-strong";
  }

  // Update UI
  if (strengthText) {
    strengthText.textContent = text;
    strengthText.style.color = color;
  }
}

// Password Match Validation
function validatePasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const confirmInput = document.getElementById("confirmPassword");

  if (confirmPassword.length === 0) {
    confirmInput.classList.remove("is-valid", "is-invalid");
    return;
  }

  if (password === confirmPassword) {
    confirmInput.classList.add("is-valid");
    confirmInput.classList.remove("is-invalid");
  } else {
    confirmInput.classList.add("is-invalid");
    confirmInput.classList.remove("is-valid");
  }
}

// Show Alert Message
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

// Simulate Login API Call
async function simulateLogin(loginData) {
  // Demo accounts for testing
  const demoAccounts = {
    "admin@universe.com": {
      password: "admin123",
      role: "admin",
      name: "Admin User",
    },
    "user@universe.com": {
      password: "user123",
      role: "user",
      name: "Regular User",
    },
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const account = demoAccounts[loginData.email];

      if (account && account.password === loginData.password) {
        resolve({
          success: true,
          message: "Login successful",
          user: {
            id: 1,
            email: loginData.email,
            name: account.name,
            role: account.role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              account.name
            )}&background=00d4ff&color=fff`,
          },
          token: "demo-jwt-token-" + Date.now(),
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1500); // Simulate network delay
  });
}

// Simulate Register API Call
async function simulateRegister(registerData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists (in a real app, this would check the database)
      const existingEmails = ["admin@universe.com", "user@universe.com"];

      if (existingEmails.includes(registerData.email)) {
        reject(new Error("Email already exists"));
        return;
      }

      resolve({
        success: true,
        message: "Registration successful",
        user: {
          id: Date.now(),
          ...registerData,
        },
      });
    }, 2000); // Simulate network delay
  });
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
    
    .password-strength {
        margin-top: 0.5rem;
        font-size: 0.875rem;
    }
    
    .strength-bar {
        height: 4px;
        background: #6c757d;
        border-radius: 2px;
        margin-top: 0.25rem;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        border-radius: 2px;
        transition: all 0.3s ease;
    }
    
    .strength-weak { width: 33.33%; background: #dc3545; }
    .strength-medium { width: 66.66%; background: #ffc107; }
    .strength-strong { width: 100%; background: #198754; }
    
    .strength-text {
        font-weight: 600;
        margin-top: 0.25rem;
    }
`;
document.head.appendChild(style);
