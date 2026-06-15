// Datos del negocio. Editar aquí si cambian dirección, teléfono o redes.
export const BAR = {
  nombre: "Punto y Coma",
  marca: ";", // signo de puntuación = marca tipográfica
  tagline: "Tapas, raciones y bocadillos en el corazón de Montilla",
  descripcion:
    "Un bar de barrio donde el salmorejo, las croquetas caseras y el rabo de toro se sirven como en casa. Ven a comer, a tapear o a reservar tu mesa.",
  direccion: "C/ Puerta de Aguilar, 54",
  ciudad: "Montilla",
  provincia: "Córdoba",
  cp: "14550",
  telefono: "957 64 33 73",
  telefonoLink: "+34957643373",
  instagram: "puntoycoma_montilla",
  instagramUrl: "https://www.instagram.com/puntoycoma_montilla/",
  // Facebook visible en la carta impresa pero sin URL conocida: añadir aquí cuando se confirme.
  facebookUrl: "",
  // Mapa (búsqueda por dirección; el dueño puede sustituir por el place id real).
  mapsQuery: "Punto y Coma, C/ Puerta de Aguilar 54, Montilla, Córdoba",
} as const;

// Horario ORIENTATIVO — pendiente de confirmar con el cliente.
// Alimenta los valores por defecto de la configuración de reservas.
export const HORARIO_TEXTO = [
  { dia: "Lunes a Jueves", horas: "12:30 – 16:30 · 20:00 – 23:30" },
  { dia: "Viernes y Sábado", horas: "12:30 – 17:00 · 20:00 – 00:00" },
  { dia: "Domingo", horas: "12:30 – 17:00" },
] as const;

export const AVISO_ALERGENOS =
  "Todos los productos pueden contener trazas de alérgenos. Información disponible en materia de alérgenos e intolerancias alimentarias. Reglamento (UE) Nº 1169/2011.";
