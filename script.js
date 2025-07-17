const materiasPorSemestre = [
  [
    { nombre: "Economía I(Introducción a la Economía)", requisitos: [] },
    { nombre: "Historia Económica General", requisitos: [] },
    { nombre: "Matemáticas I", requisitos: [] },
    { nombre: "Expresión Oral y Esctrita", requisitos: [] },
    { nombre: "Metodología de la Investigación", requisitos: [] }
    { nombre: "Cátedra Neogranadina", requisitos: [] },
    { nombre: "Principios Constitucionales", requisitos: [] }
  ],
  [
    { nombre: "Microeconomía I", requisitos: ["Fundamentos de Economía"] },
    { nombre: "Macroeconomía I", requisitos: ["Fundamentos de Economía"] },
    { nombre: "Matemáticas II", requisitos: ["Matemáticas I"] },
    { nombre: "Contabilidad Financiera", requisitos: ["Fundamentos de Contabilidad"] },
    { nombre: "Estadística I", requisitos: ["Matemáticas I"] }
  ],
  [
    { nombre: "Microeconomía II", requisitos: ["Microeconomía I"] },
    { nombre: "Macroeconomía II", requisitos: ["Macroeconomía I"] },
    { nombre: "Matemáticas III", requisitos: ["Matemáticas II"] },
    { nombre: "Estadística II", requisitos: ["Estadística I"] },
    { nombre: "Historia Económica General", requisitos: [] }
  ]
];

const aprobadas = new Set();

function estaDesbloqueada(materia) {
  return materia.requisitos.every(req => aprobadas.has(req));
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
        item.onclick = () => {
          aprobadas.add(materia.nombre);
          renderPensum();
        };
      }

      contenedor.appendChild(item);
    });

    pensumDiv.appendChild(contenedor);
  });
}

renderPensum();
