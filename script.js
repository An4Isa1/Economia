const materiasPorSemestre = [
  [
    { nombre: "Economía I (Introducción a la Economía)", requisitos: [] },
    { nombre: "Historia Económica General", requisitos: [] },
    { nombre: "Matemáticas I", requisitos: [] },
    { nombre: "Expresión Oral y Escrita", requisitos: [] },
    { nombre: "Metodología de la Investigación", requisitos: [] },
    { nombre: "Cátedra Neogranadina", requisitos: [] },
    { nombre: "Principios Constitucionales", requisitos: [] }
  ],
  [
    { nombre: "Microeconomía I", requisitos: ["Economía I (Introducción a la Economía)"] },
    { nombre: "Historia Económica Colombiana", requisitos: ["Historia Económica General"] },
    { nombre: "Matemáticas II", requisitos: ["Matemáticas I"] },
    { nombre: "Estadística I", requisitos: [] },
    { nombre: "Álgebra lineal", requisitos: [] },
    { nombre: "Humanidades I", requisitos: [] },
    { nombre: "Extensión Cultural y Deportiva", requisitos: [] }
  ],
  [
    { nombre: "Microeconomía II", requisitos: ["Microeconomía I"] },
    { nombre: "Macroeconomía I", requisitos: ["Microeconomía I"] },
    { nombre: "Matemáticas III", requisitos: ["Matemáticas II"] },
    { nombre: "Estadística II", requisitos: ["Estadística I"] },
    { nombre: "Medición Económica", requisitos: ["Microeconomía I"] }
  ],
  [
    { nombre: "Microeconomía III", requisitos: ["Microeconomía II"] },
    { nombre: "Macroeconomía II", requisitos: ["Macroeconomía I"] },
    { nombre: "Economía Matemática", requisitos: ["Matemáticas III"] },
    { nombre: "Estadística III", requisitos: ["Estadística I"] },
    { nombre: "Contabilidad General", requisitos: [] }
  ],
  [
    { nombre: "Macroeconomía III", requisitos: ["Microeconomía III", "Macroeconomía II", "Economía Matemática"] },
    { nombre: "Doctrinas Económicas I", requisitos: [] },
    { nombre: "Econometría I", requisitos: [] },
    { nombre: "Énfasis I", requisitos: [] },
    { nombre: "Matemáticas Financieras", requisitos: ["Estadística III"] },
    { nombre: "Contabilidad de Costos", requisitos: ["Contabilidad General"] }
  ],
  [
    { nombre: "Crecimiento Económico", requisitos: ["Macroeconomía III"] },
    { nombre: "Doctrinas Económicas II", requisitos: ["Doctrinas Económicas I"] },
    { nombre: "Econometría II", requisitos: [] },
    { nombre: "Énfasis II", requisitos: [] },
    { nombre: "Teoría de la Decisión", requisitos: [] },
    { nombre: "Análisis Financiero", requisitos: ["Contabilidad de Costos"] }
  ],
  [
    { nombre: "Teoría y Política Fiscal", requisitos: ["Crecimiento Económico"] },
    { nombre: "Desarrollo Económico", requisitos: [] },
    { nombre: "Teoría y Política Monetaria y Cambiaria", requisitos: [] },
    { nombre: "Énfasis III", requisitos: [] },
    { nombre: "Formulación y Evaluación de Proyectos", requisitos: [] },
    { nombre: "Humanidades II", requisitos: [] }
  ],
  [
    { nombre: "Electiva I en lo Público", requisitos: [] },
    { nombre: "Electiva I en lo Económico", requisitos: [] },
    { nombre: "Economía Internacional", requisitos: [] },
    { nombre: "Énfasis IV", requisitos: [] },
    { nombre: "Evaluación Económica y Social de Proyectos", requisitos: [] },
    { nombre: "Etica Profesional", requisitos: [] }
  ],
  [
    { nombre: "Electiva II en lo Público", requisitos: [] },
    { nombre: "Electiva II en lo Económico", requisitos: [] },
    { nombre: "Electiva en lo Internacional", requisitos: [] },
    { nombre: "Electiva de Énfasis", requisitos: ["Estadística I"] },
    { nombre: "Seminario de Grado", requisitos: [] }
  ]
];

const aprobadas = new Set();

// Cargar desde localStorage si hay guardado
const materiasGuardadas = JSON.parse(localStorage.getItem("estadoMaterias"));
if (materiasGuardadas) {
  materiasGuardadas.forEach(nombre => aprobadas.add(nombre));
}

function guardar() {
  localStorage.setItem("estadoMaterias", JSON.stringify([...aprobadas]));
}

function reiniciar() {
  if (confirm("¿Seguro que deseas reiniciar el progreso?")) {
    aprobadas.clear();
    localStorage.removeItem("estadoMaterias");
    renderPensum();
  }
}

function estaDesbloqueada(materia) {
  return materia.requisitos.every(req => aprobadas.has(req));
}

function mostrarFormulario(materia) {
  const nombre = prompt("¿Nombre del profesor?");
  const corte1 = parseFloat(prompt("Nota corte 1 (0-5):"));
  const corte2 = parseFloat(prompt("Nota corte 2 (0-5):"));
  const corte3 = parseFloat(prompt("Nota corte 3 (0-5):"));

  if (isNaN(corte1) || isNaN(corte2) || isNaN(corte3)) {
    alert("Debes ingresar números válidos para las notas.");
    return;
  }

  const definitiva = ((corte1 + corte2 + corte3) / 3).toFixed(2);

  const intento = {
    profesor: nombre,
    notas: [corte1, corte2, corte3],
    definitiva: parseFloat(definitiva)
  };

  if (intento.definitiva >= 3.0) {
    aprobadas.add(materia.nombre);
  }

  guardar();
  renderPensum();
}

function renderPensum() {
  const pensumDiv = document.getElementById('pensum');
  pensumDiv.innerHTML = '';

  materiasPorSemestre.forEach((semestre, idx) => {
    const contenedor = document.createElement('div');
    contenedor.className = 'semestre';
    contenedor.innerHTML = `<h3>Semestre ${idx + 1}</h3>`;

    semestre.forEach(materia => {
      const item = document.createElement('div');
      item.textContent = materia.nombre;

      if (aprobadas.has(materia.nombre)) {
        item.className = 'materia tachada';
      } else if (!estaDesbloqueada(materia)) {
        item.className = 'materia bloqueada';
      } else {
        item.className = 'materia';
        item.onclick = () => mostrarFormulario(materia);
      }

      contenedor.appendChild(item);
    });

    pensumDiv.appendChild(contenedor);
  });
}

renderPensum();
