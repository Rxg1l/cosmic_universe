// Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Sidebar Toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
    });
  }

  // Mobile sidebar toggle
  function handleMobileSidebar() {
    if (window.innerWidth < 768) {
      sidebar.classList.remove("collapsed");
      sidebar.classList.add("show");
    } else {
      sidebar.classList.remove("show");
    }
  }

  window.addEventListener("resize", handleMobileSidebar);
  handleMobileSidebar();

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", function (e) {
    if (window.innerWidth < 768 && sidebar.classList.contains("show")) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove("show");
      }
    }
  });

  // Notification bell animation
  const notificationBell = document.querySelector(".fa-bell");
  if (notificationBell) {
    setInterval(() => {
      notificationBell.style.transform = "rotate(20deg)";
      setTimeout(() => {
        notificationBell.style.transform = "rotate(-20deg)";
      }, 200);
      setTimeout(() => {
        notificationBell.style.transform = "rotate(0deg)";
      }, 400);
    }, 5000);
  }

  // Simulate real-time data updates
  function updateStats() {
    const stats = document.querySelectorAll(".stat-content h3");
    stats.forEach((stat) => {
      const current = parseInt(stat.textContent.replace(/,/g, ""));
      const change = Math.floor(Math.random() * 10) + 1;
      const newValue = current + change;
      stat.textContent = newValue.toLocaleString();
    });
  }

  // Update stats every 30 seconds
  setInterval(updateStats, 30000);

  // Add smooth animations to cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe cards for animation
  document.querySelectorAll(".card, .stat-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Theme switcher (optional)
  const themeSwitch = document.createElement("button");
  themeSwitch.innerHTML = '<i class="fas fa-moon"></i>';
  themeSwitch.className = "btn btn-outline-secondary btn-sm";
  themeSwitch.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
    `;

  themeSwitch.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    const icon = this.querySelector("i");
    if (document.body.classList.contains("light-theme")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  });

  document.body.appendChild(themeSwitch);

  // Add CSS for light theme
  const lightThemeStyles = `
        .light-theme {
            --primary-bg: #ffffff;
            --secondary-bg: #f8f9fa;
            --text-primary: #212529;
            --text-secondary: #6c757d;
        }
        
        .light-theme .card {
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = lightThemeStyles;
  document.head.appendChild(styleSheet);
});

// User session management
function checkUserSession() {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "../login.html";
    return;
  }

  // Update user info in sidebar
  const userData = JSON.parse(user);
  const userAvatar = document.querySelector(".user-avatar");
  const userName = document.querySelector(".user-name");
  const userRole = document.querySelector(".user-role");

  if (userAvatar)
    userAvatar.src =
      userData.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.name
      )}&background=00d4ff&color=fff`;
  if (userName) userName.textContent = userData.name;
  if (userRole)
    userRole.textContent =
      userData.role === "admin" ? "Administrator" : "Space Explorer";
}

// Initialize session check when dashboard loads
if (
  window.location.pathname.includes("dashboard.html") ||
  window.location.pathname.includes("admin/") ||
  window.location.pathname.includes("user/")
) {
  checkUserSession();
}

// Logout function
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "../login.html";
}

// Add logout event listeners
document.addEventListener("DOMContentLoaded", function () {
  const logoutButtons = document.querySelectorAll('a[href*="login.html"]');
  logoutButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  });
});
