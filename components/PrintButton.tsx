"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn btn-ghost print:hidden">
      Imprimir
    </button>
  );
}
