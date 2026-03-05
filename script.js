const API_KEY = "f9caacb6f3ed78ecb37325173896724f";
const listaPeliculas = [
  "Lo que el viento se llevó",
  "American History X",
  "L.A. Confidential",
  "Conspiracy Theory",
  "Extraños en un tren",
  "Psicosis",
  "Dirty Dancing",
  "Sleepers",
  "39 escalones",
  "Ni un pelo de tonto",
  "Beautiful Girls",
  "El talento de Mr. Ripley",
  "El show de Truman",
  "El sueño eterno",
  "La dama de Shangai",
  "En bandeja de plata",
  "El tercer hombre",
  "El crepúsculo de los dioses",
  "El secreto de sus ojos",
  "The client",
  "The Adventures of Robin Hood",
  "Amsterdam",
  "La gran estafa americana",
  "El juicio de los 7 de Chicago",
  "La red social",
  "La sociedad de la nieve",
  "Un mundo perfecto",
];

let peliculasData = []; // Guardaremos los objetos aquí

async function cargarPeliculas() {
  const cont = document.getElementById("contenedor");
  for (const nombre of listaPeliculas) {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(nombre)}&language=es-ES`,
    );
    const data = await res.json();
    if (data.results[0]) {
      const p = data.results[0];
      peliculasData.push(p);
      cont.innerHTML += `
                              <div class="card" onclick="verDetalle(${p.id})">
                                  <img src="https://image.tmdb.org/t/p/w500${p.poster_path}" alt="${p.title}">
                                  <div class="card-info"><b>${p.title}</b><br>${p.release_date.split("-")[0]}</div>
                              </div>`;
    }
  }
}

async function verDetalle(id) {
  // Buscamos detalles + donde verla (watch/providers)
  const resDetalle = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`,
  );
  const p = await resDetalle.json();

  const resProviders = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`,
  );
  const providersData = await resProviders.json();

  // Filtramos por España (ES) y por suscripción (flatrate)
  const providers = providersData.results?.ES?.flatrate || [];

  const modalData = document.getElementById("modal-data");
  modalData.innerHTML = `
                      <img class="modal-img" src="https://image.tmdb.org/t/p/w500${p.poster_path}">
                      <div class="modal-text">
                          <h2>${p.title}</h2>
                          <p><i>${p.tagline || ""}</i></p>
                          <p>${p.overview.substring(0, 200)}...</p>
                          <div class="providers">
                              <strong>Disponible en: </strong>
                              ${
                                providers.length > 0
                                  ? providers
                                      .map(
                                        (pr) =>
                                          `<img class="provider-logo" src="https://image.tmdb.org/t/p/original${pr.logo_path}" title="${pr.provider_name}">`,
                                      )
                                      .join("")
                                  : '<span class="no-provider">No disponible en streaming (ES)</span>'
                              }
                          </div>
                      </div>
                  `;
  document.getElementById("modal").style.display = "flex";
}

function seleccionarAleatoria() {
  if (peliculasData.length === 0) return;
  const random =
    peliculasData[Math.floor(Math.random() * peliculasData.length)];
  verDetalle(random.id);
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

// Cerrar al hacer clic fuera del contenido
window.onclick = (e) => {
  if (e.target == document.getElementById("modal")) cerrarModal();
};

cargarPeliculas();
