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

let progreso = JSON.parse(localStorage.getItem("progreso")) || {};

function crearPensum() {
  const contenedor = document.getElementById("contenedor-semestres");
  contenedor.innerHTML = "";
  Object.entries(materias).forEach(([semestre, lista], i) => {
    const div = document.createElement("div");
    div.className = `semestre semestre-${i + 1}`;
    const titulo = document.createElement("h3");
    titulo.textContent = semestre;
    div.appendChild(titulo);

    lista.forEach(materia => {
      const divMateria = document.createElement("div");
      divMateria.textContent = materia.nombre;
      divMateria.className = "materia";
      if (!estaDesbloqueada(materia)) {
        divMateria.classList.add("bloqueada");
      } else if (progreso[materia.nombre]) {
        divMateria.classList.add("aprobada");
      }

      divMateria.onclick = () => {
        if (!estaDesbloqueada(materia)) {
          alert("Materia bloqueada. Requiere: " + materia.requisitos.join(", "));
          return;
        }
        if (!progreso[materia.nombre]) {
          const n1 = parseFloat(prompt("Nota corte 1 (0-5):"));
          const n2 = parseFloat(prompt("Nota corte 2 (0-5):"));
          const n3 = parseFloat(prompt("Nota corte 3 (0-5):"));
          const profesor = prompt("Nombre del profesor:");
          const promedio = ((n1 + n2 + n3) / 3).toFixed(2);

          progreso[materia.nombre] = {
            notas: [n1, n2, n3],
            promedio,
            profesor
          };
          guardarProgreso();
          crearPensum();
          actualizarTabla();
        }
      };
      div.appendChild(divMateria);
    });

    contenedor.appendChild(div);
  });
}

function estaDesbloqueada(materia) {
  if (!materia.requisitos) return true;
  return materia.requisitos.every(req => progreso[req]);
}

function guardarProgreso() {
  localStorage.setItem("progreso", JSON.stringify(progreso));
}

function reiniciarProgreso() {
  if (confirm("¿Seguro que deseas borrar todo el progreso?")) {
    progreso = {};
    guardarProgreso();
    crearPensum();
    actualizarTabla();
  }
}

function actualizarTabla() {
  const cuerpo = document.querySelector("#tablaResumen tbody");
  cuerpo.innerHTML = "";

  Object.entries(progreso).forEach(([nombre, datos]) => {
    const fila = document.createElement("tr");
    const semestre = encontrarSemestre(nombre);

    fila.innerHTML = `
      <td>${semestre}</td>
      <td>${nombre}</td>
      <td>${datos.promedio}</td>
      <td>${datos.profesor}</td>
    `;
    cuerpo.appendChild(fila);
  });
}

function encontrarSemestre(materiaNombre) {
  return Object.keys(materias).find(sem =>
    materias[sem].some(m => m.nombre === materiaNombre)
  );
}

// Inicialización
crearPensum();
actualizarTabla();
document.addEventListener('DOMContentLoaded', () => {
  const materias = document.querySelectorAll('li');
  materias.forEach(materia => {
    const estado = localStorage.getItem(materia.textContent);
    if (estado) {
      const data = JSON.parse(estado);
      if (data.aprobada) {
        materia.classList.add('aprobada');
      }
    }

    materia.addEventListener('click', () => {
      if (materia.classList.contains('aprobada')) return;

      const notas = [
        parseFloat(prompt(`Nota 1 de ${materia.textContent}`)),
        parseFloat(prompt(`Nota 2 de ${materia.textContent}`)),
        parseFloat(prompt(`Nota 3 de ${materia.textContent}`))
      ];

      if (notas.some(isNaN)) {
        alert("Por favor, ingresa notas válidas.");
        return;
      }

      const promedio = (notas[0] + notas[1] + notas[2]) / 3;
      const profesor = prompt("Nombre del profesor:");

      const data = {
        notas,
        promedio,
        profesor,
        aprobada: true
      };

      localStorage.setItem(materia.textContent, JSON.stringify(data));
      materia.classList.add('aprobada');
      agregarResumen(materia, promedio, profesor);
    });
  });

  cargarResumen();
});

function agregarResumen(materia, promedio, profesor) {
  const fila = document.createElement('tr');
  const semestre = materia.closest('.semestre').dataset.semestre;
  fila.innerHTML = `
    <td>${semestre}</td>
    <td>${materia.textContent}</td>
    <td>${promedio.toFixed(2)}</td>
    <td>${profesor}</td>
  `;
  document.querySelector('#resumen tbody').appendChild(fila);
}

function cargarResumen() {
  const tbody = document.querySelector('#resumen tbody');
  tbody.innerHTML = '';
  document.querySelectorAll('li').forEach(materia => {
    const estado = localStorage.getItem(materia.textContent);
    if (estado) {
      const data = JSON.parse(estado);
      if (data.aprobada) {
        agregarResumen(materia, data.promedio, data.profesor);
      }
    }
  });
}

function reiniciarProgreso() {
  localStorage.clear();
  location.reload();
}
