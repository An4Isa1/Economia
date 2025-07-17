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
    { nombre: "Estadística III", requisitos: ["Estadística II"] },
    { nombre: "Contabilidad General", requisitos: [] }
  ],
  [
    { nombre: "Macroeconomía III", requisitos: ["Microeconomía III", "Macroeconomía II", "Economía Matemática"] },
    { nombre: "Doctrinas Económicas I", requisitos: [] },
    { nombre: "Econometría I", requisitos: ["Estadística III"] },
    { nombre: "Énfasis I", requisitos: [] },
    { nombre: "Matemáticas Financieras", requisitos: ["Estadística III"] },
    { nombre: "Contabilidad de Costos", requisitos: ["Contabilidad General"] }
  ],
  [
    { nombre: "Crecimiento Económico", requisitos: ["Macroeconomía III"] },
    { nombre: "Doctrinas Económicas II", requisitos: ["Doctrinas Económicas I"] },
    { nombre: "Econometría II", requisitos: ["Econometría I"] },
    { nombre: "Énfasis II", requisitos: ["Énfasis I"] },
    { nombre: "Teoría de la Decisión", requisitos: [] },
    { nombre: "Análisis Financiero", requisitos: ["Contabilidad de Costos"] }
  ],
  [
    { nombre: "Teoría y Política Fiscal", requisitos: ["Crecimiento Económico"] },
    { nombre: "Desarrollo Económico", requisitos: ["Crecimiento Económico"] },
    { nombre: "Teoría y Política Monetaria y Cambiaria", requisitos: ["Macroeconomía III"] },
    { nombre: "Énfasis III", requisitos: ["Énfasis II"] },
    { nombre: "Formulación y Evaluación de Proyectos", requisitos: ["Econometría II"] },
    { nombre: "Humanidades II", requisitos: [] }
  ],
  [
    { nombre: "Electiva I en lo Público", requisitos: [] },
    { nombre: "Electiva I en lo Económico", requisitos: [] },
    { nombre: "Economía Internacional", requisitos: ["Macroeconomía III"] },
    { nombre: "Énfasis IV", requisitos: ["Énfasis III"] },
    { nombre: "Evaluación Económica y Social de Proyectos", requisitos: ["Formulación y Evaluación de Proyectos"] },
    { nombre: "Ética Profesional", requisitos: [] }
  ],
  [
    { nombre: "Electiva II en lo Público", requisitos: [] },
    { nombre: "Electiva II en lo Económico", requisitos: [] },
    { nombre: "Electiva en lo Internacional", requisitos: [] },
    { nombre: "Electiva de Énfasis", requisitos: ["Estadística I"] },
    { nombre: "Seminario de Grado", requisitos: ["Evaluación Económica y Social de Proyectos"] }
  ]
];

let estadoMaterias = JSON.parse(localStorage.getItem("estadoMaterias")) || {};

function guardar() {
  localStorage.setItem("estadoMaterias", JSON.stringify(estadoMaterias));
}

function reiniciar() {
  if (confirm("¿Seguro que deseas reiniciar todo el pensum?")) {
    estadoMaterias = {};
    guardar();
    renderPensum();
  }
}

function estaDesbloqueada(materia) {
  return materia.requisitos.every(req => estadoMaterias[req]?.aprobada);
}

function mostrarFormulario(materia) {
  const profesor = prompt("Nombre del profesor:");
  const corte1 = parseFloat(prompt("Nota corte 1 (0-5):"));
  const corte2 = parseFloat(prompt("Nota corte 2 (0-5):"));
  const corte3 = parseFloat(prompt("Nota corte 3 (0-5):"));

  if ([corte1, corte2, corte3].some(n => isNaN(n) || n < 0 || n > 5)) {
    alert("Debes ingresar notas válidas entre 0 y 5.");
    return;
  }

  const definitiva = parseFloat(((corte1 + corte2 + corte3) / 3).toFixed(2));

  estadoMaterias[materia.nombre] = {
    profesor,
    notas: [corte1, corte2, corte3],
    definitiva,
    aprobada: definitiva >= 3.0
  };

  guardar();
  renderPensum();
}

function renderPensum() {
  const pensumDiv = document.getElementById("pensum");
  pensumDiv.innerHTML = "";

  const fila1 = document.createElement("div");
  fila1.className = "fila";
  const fila2 = document.createElement("div");
  fila2.className = "fila";

  materiasPorSemestre.forEach((semestre, i) => {
    const columna = document.createElement("div");
    columna.className = `semestre semestre-${i + 1}`;
    columna.innerHTML = `<h3>Semestre ${i + 1}</h3>`;

    semestre.forEach(materia => {
      const info = estadoMaterias[materia.nombre];
      const item = document.createElement("div");
      item.className = "materia";
      item.innerHTML = `<strong>${materia.nombre}</strong>`;

      if (info?.aprobada) {
        item.classList.add("aprobada");
        item.innerHTML += `
          <br><small>Prof: ${info.profesor}</small>
          <br><small>Notas: ${info.notas.join(", ")}</small>
          <br><small>Def: ${info.definitiva}</small>
        `;
      } else if (!estaDesbloqueada(materia)) {
        item.classList.add("bloqueada");
      } else {
        item.classList.add("desbloqueada");
        item.onclick = () => mostrarFormulario(materia);
      }

      columna.appendChild(item);
    });

    if (i < 4) fila1.appendChild(columna);
    else fila2.appendChild(columna);
  });

  pensumDiv.appendChild(fila1);
  pensumDiv.appendChild(fila2);
}

renderPensum();
