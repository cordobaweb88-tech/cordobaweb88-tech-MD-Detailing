"use strict";

// Completar con el número internacional, solo dígitos, cuando esté disponible.
const whatsappNumber = "";
const defaultMessage = "Hola, quiero solicitar un presupuesto.";
const whatsappUrl = (message) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.href = whatsappUrl(defaultMessage);
});

const preloader = document.getElementById("preloader");
window.addEventListener("load", () => preloader.classList.add("loaded"), { once: true });

// La animación progresiva solo se activa cuando el navegador soporta el observador.
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("navigation");

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

// Los filtros mantienen las tarjetas accesibles también para teclado.
const filters = document.querySelectorAll(".filter");
const galleryItems = document.querySelectorAll(".gallery-item");
filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    galleryItems.forEach((item) => {
      item.hidden = button.dataset.filter !== "todos" && item.dataset.category !== button.dataset.filter;
    });
  });
});

// La comparación es una simulación visual; se pueden reemplazar las imágenes por pares reales.
const comparisonImages = {
  detailing: { src: "assets/car-dark.jpg", alt: "Vista ilustrativa de un vehículo con acabado brillante" },
  chapa: { src: "assets/bodywork.jpg", alt: "Vista ilustrativa de un vehículo en un taller" },
  pintura: { src: "assets/car-detail.jpg", alt: "Vista ilustrativa de la pintura de un automóvil" }
};
const comparison = document.querySelector(".compare");
const range = comparison.querySelector('input[type="range"]');
const comparisonTabs = document.querySelectorAll(".comparison-tab");

function selectComparison(name) {
  const image = comparisonImages[name];
  if (!image) return;
  const after = comparison.querySelector(".compare-after");
  const before = comparison.querySelector(".compare-before img");
  after.src = image.src;
  after.alt = image.alt;
  before.src = image.src;
  range.value = "50";
  comparison.style.setProperty("--position", "50%");
  comparisonTabs.forEach((tab) => {
    const active = tab.dataset.comparison === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
}
comparisonTabs.forEach((tab) => tab.addEventListener("click", () => selectComparison(tab.dataset.comparison)));
document.querySelectorAll(".gallery-item[data-comparison]").forEach((item) => {
  item.addEventListener("click", () => selectComparison(item.dataset.comparison));
});
range.addEventListener("input", () => comparison.style.setProperty("--position", `${range.value}%`));

// El formulario prepara el mensaje; el usuario confirma su envío en WhatsApp.
document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "Hola, quiero solicitar un presupuesto.",
    `Nombre: ${data.get("nombre")}`,
    `Teléfono: ${data.get("telefono")}`,
    `Vehículo: ${data.get("vehiculo")}`,
    `Servicio: ${data.get("servicio")}`,
    `Mensaje: ${data.get("mensaje")}`
  ].join("\n");
  window.location.assign(whatsappUrl(message));
});

document.getElementById("year").textContent = String(new Date().getFullYear());
