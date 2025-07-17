const materias = {
  "Semestre 1": [
    { nombre: "Matemáticas I" },
    { nombre: "Introducción a la Economía" },
    { nombre: "Historia Económica" },
    { nombre: "Contabilidad General" },
    { nombre: "Expresión Oral y Escrita" }
  ],
  "Semestre 2": [
    { nombre: "Matemáticas II", requisitos: ["Matemáticas I"] },
    { nombre: "Microeconomía I", requisitos: ["Introducción a la Economía"] },
    { nombre: "Estadística I", requisitos: ["Matemáticas I"] },
    { nombre: "Contabilidad de Costos", requisitos: ["Contabilidad General"] },
    { nombre: "Filosofía" }
  ],
  "Semestre 3": [
    { nombre: "Matemáticas III", requisitos: ["Matemáticas II"] },
    { nombre: "Microeconomía II", requisitos: ["Microeconomía I"] },
    { nombre: "Estadística II", requisitos: ["Estadística I"] },
    { nombre: "Pensamiento Económico", requisitos: ["Historia Económica"] },
    { nombre: "Informática Aplicada" }
  ],
  "Semestre 4": [
    { nombre: "Cálculo Multivariable", requisitos: ["Matemáticas III"] },
    { nombre: "Macroeconomía I", requisitos: ["Microeconomía II"] },
    { nombre: "Econometría I", requisitos: ["Estadística II"] },
    { nombre: "Fundamentos de Administración" },
    { nombre: "Derecho Económico" }
  ],
  "Semestre 5": [
    { nombre: "Macroeconomía II", requisitos: ["Macroeconomía I"] },
    { nombre: "Econometría II", requisitos: ["Econometría I"] },
    { nombre: "Internacional I" },
    { nombre: "Finanzas" }
  ],
  "Semestre 6": [
    { nombre: "Desarrollo Económico" },
    { nombre: "Internacional II", requisitos: ["Internacional I"] },
    { nombre: "Investigación II" },
    { nombre: "Optativa I" }
  ],
  "Semestre 7": [
    { nombre: "Economía del Sector Público" },
    { nombre: "Optativa II" },
    { nombre: "Electiva II" },
    { nombre: "Seminario de Investigación" }
  ],
  "Semestre 8": [
    { nombre: "Optativa III" },
    { nombre: "Electiva III" },
    { nombre: "Práctica Profesional" },
    { nombre: "Proyecto II" }
  ],
  "Semestre 9": [
    { nombre: "Trabajo de Grado" },
    { nombre: "Optativa IV" },
    { nombre: "Electiva IV" },
    { nombre: "Seminario Económico" }
  ]
};

function crearMateria(materia, semestre, container) {
  const div = document.createElement("div");
  div.className = "materia";
  div.textContent = materia.nombre;
  div.onclick = () => manejarClickMateria(materia, div, semestre);
  container.appendChild(div);
}

function manejarClickMateria(materia, div, semestre) {
  if (materia.requisitos && !materia.requisitos.every(req => materiaAprobada(req))) {
    alert(`Debes aprobar: ${materia.requisitos.join(", ")}`);
    return;
  }

  const notas = [];
  for (let i = 1; i <= 3; i++) {
    const nota = parseFloat(prompt(`Ingrese nota del corte ${i} para ${materia.nombre}:`));
    if (isNaN(nota) || nota < 0 || nota > 5) return alert("Nota inválida");
    notas.push(nota);
  }

  const promedio = (notas.reduce((a, b) => a + b, 0) / 3).toFixed(2);
  const profesor = prompt("Ingrese el nombre del profesor:");

  const data = { promedio, profesor };
  localStorage.setItem(materia.nombre, JSON.stringify(data));

  div.classList.add("aprobada");
  agregarResumen(semestre, materia.nombre, promedio, profesor);
}

function agregarResumen(semestre, materia, promedio, profesor) {
  const tabla = document.querySelector("#resumen tbody");
  const fila = document.createElement("tr");

  [semestre, materia, promedio, profesor].forEach(valor => {
    const celda = document.createElement("td");
    celda.textContent = valor;
    fila.appendChild(celda);
  });

  tabla.appendChild(fila);
}

function materiaAprobada(nombre) {
  return !!localStorage.getItem(nombre);
}

function cargarMaterias() {
  for (let i = 1; i <= 9; i++) {
    const div = document.createElement("div");
    div.className = `semestre semestre-${i}`;
    const titulo = document.createElement("h4");
    titulo.innerHTML = `<em>Semestre ${i}</em>`;
    div.appendChild(titulo);

    (materias[i] || []).forEach(m => crearMateria(m, i, div));

    if (i <= 4) {
      document.getElementById("semestres-superior").appendChild(div);
    } else {
      document.getElementById("semestres-inferior").appendChild(div);
    }
  }
}

function cargarResumen() {
  for (let nombre in localStorage) {
    const data = JSON.parse(localStorage.getItem(nombre));
    for (let i = 1; i <= 9; i++) {
      if (materias[i]?.some(m => m.nombre === nombre)) {
        agregarResumen(i, nombre, data.promedio, data.profesor);
      }
    }
  }
}

function reiniciarProgreso() {
  if (confirm("¿Seguro que quieres reiniciar todo tu progreso?")) {
    localStorage.clear();
    location.reload();
  }
}

window.onload = () => {
  cargarMaterias();
  cargarResumen();
};
