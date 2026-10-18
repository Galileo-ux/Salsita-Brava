const SITE_CONFIG = Object.freeze({
  whatsappNumber: "528136412170",
});

const whatsappBaseUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
const defaultWhatsappMessage =
  "Hola, quiero hacer un pedido en Salsita Brava. ¿Me pueden compartir las opciones disponibles?";
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");

whatsappLinks.forEach((link) => {
  const message = link.dataset.whatsappMessage || defaultWhatsappMessage;
  link.href = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
});

const whatsappNumberLabel = document.querySelector("[data-whatsapp-number]");

if (whatsappNumberLabel) {
  const localNumber = SITE_CONFIG.whatsappNumber.slice(-10);
  whatsappNumberLabel.textContent = localNumber.replace(
    /^(\d{3})(\d{3})(\d{4})$/,
    "$1 $2 $3"
  );
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");

if (menuToggle && siteNavigation) {
  const setMenuOpen = (isOpen, restoreFocus = false) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    siteNavigation.classList.toggle("is-open", isOpen);

    if (!isOpen && restoreFocus) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  siteNavigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      setMenuOpen(false);
    }
  });
}

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const revealElements = document.querySelectorAll(".reveal");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (
  revealElements.length > 0 &&
  !reducedMotionPreference.matches &&
  typeof window.IntersectionObserver === "function"
) {
  document.documentElement.classList.add("js-motion");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  reducedMotionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      revealObserver.disconnect();
      document.documentElement.classList.remove("js-motion");
      revealElements.forEach((element) => element.classList.add("is-visible"));
    }
  });
}
