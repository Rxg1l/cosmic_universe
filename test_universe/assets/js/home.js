// Homepage JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Navbar background on scroll
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(10, 14, 23, 0.95)";
      navbar.style.backdropFilter = "blur(10px)";
    } else {
      navbar.style.background = "transparent";
      navbar.style.backdropFilter = "none";
    }
  });

  // Animate elements on scroll
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

  // Observe feature cards and other elements
  document
    .querySelectorAll(".feature-card, .about-text, .stat")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  // Add cosmic particles to hero section
  createCosmicParticles();
});

// Create floating particles in background
function createCosmicParticles() {
  const heroSection = document.querySelector(".hero-section");
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "cosmic-particles";
  particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

  heroSection.appendChild(particlesContainer);

  // Create multiple particles
  for (let i = 0; i < 20; i++) {
    createParticle(particlesContainer);
  }
}

function createParticle(container) {
  const particle = document.createElement("div");
  const size = Math.random() * 3 + 1;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const duration = Math.random() * 10 + 10;
  const delay = Math.random() * 5;

  particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${posX}%;
        top: ${posY}%;
        animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
    `;

  container.appendChild(particle);
}

// Add CSS for particle animation
const particleStyle = document.createElement("style");
particleStyle.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.5;
        }
        25% {
            transform: translate(20px, -20px) rotate(90deg);
            opacity: 1;
        }
        50% {
            transform: translate(40px, 0) rotate(180deg);
            opacity: 0.5;
        }
        75% {
            transform: translate(20px, 20px) rotate(270deg);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(particleStyle);
