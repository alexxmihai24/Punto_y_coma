// Carta fija del bar, transcrita de las fotos en /public/carta-original.
// El "Menú del día" NO está aquí: es editable desde /admin (Supabase).

export type Racion = {
  nombre: string;
  tapa?: number; // columna "Tipo" (tapa)
  media?: number; // 1/2 ración
  racion?: number; // ración
  nota?: string; // p. ej. "1,20 €/ud" o "*Congelado"
};

export type ItemLista = {
  num?: string; // número de la carta (0, 1, 10 BUEY...)
  nombre: string;
  descripcion?: string;
  precio?: number; // si falta, se muestra "Consultar"
};

export const RACIONES: Racion[] = [
  { nombre: "Ensaladilla Rusa", tapa: 4.5, media: 7, racion: 11 },
  { nombre: "Salpicón de Marisco", tapa: 5.5, media: 9, racion: 12 },
  { nombre: "Salmorejo", tapa: 4, media: 6, racion: 9 },
  { nombre: "Queso Curado (100 gr/ración)", tapa: 5, media: 8, racion: 12 },
  { nombre: "Boquerones en Vinagre", tapa: 5, media: 8, racion: 12, nota: "*Congelado" },
  { nombre: "Patatas Ali-oli", tapa: 4.5, media: 7, racion: 11 },
  { nombre: "Patatas Bravas / Roquefort", tapa: 4.5, media: 7, racion: 11 },
  { nombre: "Tortilla de Patatas", tapa: 4.5, media: 7, racion: 11 },
  { nombre: "Patatas Fritas", tapa: 3.5, media: 5, racion: 6.5 },
  { nombre: "Cipotillos", media: 7, racion: 11, nota: "1,20 €/ud" },
  { nombre: "Chipirón a la Plancha", media: 12, racion: 17 },
  { nombre: "Chorizo al Vino", media: 8, racion: 12 },
  { nombre: "Croquetas Caseras de Jamón", media: 9, racion: 14 },
  { nombre: "Croquetas Caseras de Rabo de Toro", media: 9, racion: 14 },
  { nombre: "Calamares Fritos", media: 9, racion: 14 },
  { nombre: "Carne en Salsa de Tomate", media: 7, racion: 12 },
  { nombre: "Lagrimitas de Pollo", media: 8, racion: 14 },
  { nombre: "Filo de Solomillo", media: 9.5, racion: 13 },
  { nombre: "Mejillón Gallego al Vapor", media: 6, racion: 10 },
  { nombre: "Jamón Ibérico", racion: 13 },
  { nombre: "Gulas con Gambas", racion: 12.5 },
  { nombre: "Ensalada Mixta", racion: 10 },
  { nombre: "Bacon & Cheese", racion: 10.5 },
  { nombre: "Flamenquín", racion: 12 },
  { nombre: "San Jacobo", racion: 12 },
  { nombre: "Crispín", racion: 11 },
  { nombre: "Pez Espada", racion: 16 },
  { nombre: "Sepia a la Plancha", racion: 15.5 },
  { nombre: "Pinchitos con Patatas", racion: 6 },
  { nombre: "Carrillada Ibérica", racion: 15.5 },
  { nombre: "Pulpo a la Gallega", racion: 15 },
  { nombre: "Presa Ibérica", racion: 17 },
  { nombre: "Rabo de Toro", racion: 17.5 },
  { nombre: "Chuletón de Ternera (800 gr aprox.)", racion: 32 },
];

export const BOCADILLOS: ItemLista[] = [
  { num: "0", nombre: "Salmón Ahumado y Queso", precio: 6.5 },
  { num: "1", nombre: "Jamón York, Queso, Ensalada y Tomate", precio: 5.4 },
  { num: "2", nombre: "Tortilla de Patatas", precio: 5.2 },
  { num: "3", nombre: "Cochinillo y Ensalada", precio: 5.2 },
  { num: "4", nombre: "Calamares", precio: 7 },
  { num: "5", nombre: "Flamenquín", precio: 7 },
  { num: "6", nombre: "Lomo, Queso y Pimientos", precio: 6.2 },
  { num: "7", nombre: "Lomo, Tortilla Francesa y Pimientos", precio: 6.2 },
  { num: "8", nombre: "Bacon, Queso y Tomate", precio: 6 },
  { num: "9", nombre: "Lomo, Jamón Serrano y Pimientos", precio: 6.2 },
  { num: "10", nombre: "Hamburguesa, Tomate, Lechuga y Cebolla", precio: 5.7 },
  { num: "10 BUEY", nombre: "Hamburguesa de Buey, Tomate, Lechuga y Cebolla", precio: 7.5 },
  {
    num: "11",
    nombre: "Hamburguesa completa",
    descripcion: "Tomate, Lechuga, Cebolla, Bacon, Queso y Huevo Frito",
    precio: 6.9,
  },
  {
    num: "11 BUEY",
    nombre: "Hamburguesa de Buey completa",
    descripcion: "Tomate, Lechuga, Cebolla, Bacon, Queso y Huevo Frito",
    precio: 9,
  },
  { num: "12", nombre: "Lomo, Tortilla de Patatas, Jamón Serrano, Pimientos y Queso", precio: 7 },
  { num: "13", nombre: "Sándwich Mixto", descripcion: "Jamón York, Queso y Mantequilla", precio: 4.5 },
  {
    num: "14",
    nombre: "Sándwich Vegetal",
    descripcion: "Mantequilla, Tomate, Lechuga, Huevo Frito y Espárragos",
    precio: 5,
  },
  { num: "15", nombre: "Pechuga de Pollo (plancha o empanado), Lechuga y Tomate", precio: 6.2 },
  { num: "Súper", nombre: "Campero Súper", descripcion: "Jamón York, Queso, Ensalada y Tomate", precio: 6 },
  { num: "Hot Dog", nombre: "Perrito Caliente", descripcion: "Queso, cebolla y bacon", precio: 7 },
];

export const SALSAS = "Mahonesa, Ketchup, Rosa, Brava, Roquefort y Ali-oli";

export const PLATOS_COMBINADOS: ItemLista[] = [
  { num: "16", nombre: "Lomo, Huevos Fritos y Patatas Fritas", precio: 10 },
  { num: "17", nombre: "Flamenquín, Huevos Fritos y Patatas", precio: 14.5 },
  { num: "18", nombre: "Pechuga de Pollo a la Plancha y Ensalada Mixta", precio: 10 },
  { num: "19", nombre: "Crispín, Huevos Fritos y Ensalada o Patatas Fritas", precio: 14 },
  { num: "20", nombre: "Huevos Fritos, Patatas Fritas y Chorizo", precio: 10.5 },
  { num: "21", nombre: "Pollo Empanado, Huevos Fritos y Patatas Fritas", precio: 12.5 },
];

export const COMBINADOS_NOTA = "Se incluye el pan; no se incluye la bebida ni el postre.";

export const REVUELTOS: ItemLista[] = [
  { num: "22", nombre: "Gulas con Gambas", precio: 13 },
  { num: "23", nombre: "Bacalao", precio: 12 },
  { num: "24", nombre: "Chanquetes", precio: 13 },
];

export type SeccionCarta =
  | { id: string; titulo: string; tipo: "raciones"; items: Racion[]; nota?: string }
  | { id: string; titulo: string; tipo: "lista"; items: ItemLista[]; nota?: string };

export const CARTA: SeccionCarta[] = [
  { id: "raciones", titulo: "Raciones", tipo: "raciones", items: RACIONES },
  { id: "bocadillos", titulo: "Bocadillos", tipo: "lista", items: BOCADILLOS, nota: `Salsas: ${SALSAS}` },
  { id: "combinados", titulo: "Platos Combinados", tipo: "lista", items: PLATOS_COMBINADOS, nota: COMBINADOS_NOTA },
  { id: "revueltos", titulo: "Revueltos", tipo: "lista", items: REVUELTOS },
];

// Formatea un número como precio en euros: 4.5 -> "4,50 €"
export function euros(n: number): string {
  return (
    n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"
  );
}
