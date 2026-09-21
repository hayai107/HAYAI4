document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     Utilidades
  ======================================================= */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* =======================================================
     Pétalos flotantes de fondo
  ======================================================= */
  function crearPetalosFlotantes() {
    const contenedor = $("#petalos-flotantes");
    const cantidad = window.innerWidth < 600 ? 12 : 20;
    for (let i = 0; i < cantidad; i++) {
      const petalo = document.createElement("div");
      petalo.className = "petalo-flotante";
      const izquierda = Math.random() * 100;
      const duracion = 14 + Math.random() * 10;
      const retraso = Math.random() * 14;
      const deriva = (Math.random() * 80 - 40) + "px";
      const tamano = 6 + Math.random() * 6;
      petalo.style.left = izquierda + "vw";
      petalo.style.width = tamano + "px";
      petalo.style.height = tamano + "px";
      petalo.style.animationDuration = duracion + "s";
      petalo.style.animationDelay = "-" + retraso + "s";
      petalo.style.setProperty("--drift", deriva);
      if (Math.random() > 0.6) petalo.style.background = "var(--rosa-suave)";
      contenedor.appendChild(petalo);
    }
  }
  crearPetalosFlotantes();

  /* =======================================================
     Música de fondo
  ======================================================= */
  const musica = $("#musica-fondo");
  const btnMusica = $("#btn-musica");

  function intentarReproducir() {
    musica.volume = 0.55;
    musica.play().then(() => {
      btnMusica.classList.remove("silenciado");
    }).catch(() => {
      btnMusica.classList.add("silenciado");
    });
  }

  btnMusica.addEventListener("click", () => {
    if (musica.paused) {
      intentarReproducir();
    } else {
      musica.pause();
      btnMusica.classList.add("silenciado");
    }
  });

  /* =======================================================
     Revelado del texto al hacer scroll, junto al árbol
  ======================================================= */
  const elementosObservados = Array.from($$(".linea-observada"));
  elementosObservados.forEach((el, i) => {
    el.style.transitionDelay = (i * 140) + "ms";
  });

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("mostrar");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.35 });

  elementosObservados.forEach((el) => observador.observe(el));

  /* =======================================================
     Construcción del árbol de girasoles (SVG dinámico)
  ======================================================= */

  const troncoPath = "M181,556 C177,505 182,455 187,415 C189,401 194,391 197,381 L203,381 C206,391 211,401 213,415 C218,455 223,505 219,556 Z";

  // Copa de follaje: círculos superpuestos que forman la silueta redonda del árbol
  const copa = [
    { x: 200, y: 225, r: 92 },
    { x: 128, y: 253, r: 58 },
    { x: 272, y: 253, r: 58 },
    { x: 154, y: 176, r: 54 },
    { x: 246, y: 176, r: 54 },
    { x: 200, y: 152, r: 56 },
    { x: 96,  y: 292, r: 42 },
    { x: 304, y: 292, r: 42 },
    { x: 200, y: 292, r: 68 },
  ];

  const girasoles = [
    { x: 200, y: 150, e: 1.05, r: 0 },
    { x: 150, y: 160, e: 0.85, r: -15 },
    { x: 250, y: 160, e: 0.85, r: 15 },
    { x: 118, y: 188, e: 0.8,  r: -20 },
    { x: 282, y: 188, e: 0.8,  r: 20 },
    { x: 200, y: 188, e: 1.0,  r: 0 },
    { x: 160, y: 208, e: 0.75, r: -8 },
    { x: 240, y: 208, e: 0.75, r: 8 },
    { x: 90,  y: 228, e: 0.7,  r: -25 },
    { x: 310, y: 228, e: 0.7,  r: 25 },
    { x: 130, y: 236, e: 0.85, r: -12 },
    { x: 270, y: 236, e: 0.85, r: 12 },
    { x: 200, y: 226, e: 1.15, r: 0 },
    { x: 170, y: 252, e: 0.8,  r: -5 },
    { x: 230, y: 252, e: 0.8,  r: 5 },
    { x: 100, y: 262, e: 0.65, r: -18 },
    { x: 300, y: 262, e: 0.65, r: 18 },
    { x: 150, y: 272, e: 0.75, r: -10 },
    { x: 250, y: 272, e: 0.75, r: 10 },
    { x: 200, y: 266, e: 0.9,  r: 0 },
    { x: 120, y: 288, e: 0.6,  r: -22 },
    { x: 280, y: 288, e: 0.6,  r: 22 },
    { x: 180, y: 298, e: 0.7,  r: -4 },
    { x: 220, y: 298, e: 0.7,  r: 4 },
  ];

  function crearGirasolSVG(g, indice) {
    let petalos = "";
    const numPetalos = 11;
    for (let i = 0; i < numPetalos; i++) {
      const angulo = (360 / numPetalos) * i;
      petalos += `<ellipse cx="0" cy="-9.5" rx="3.6" ry="10" fill="url(#gradPetalo)" transform="rotate(${angulo})"/>`;
    }
    const semillas = `
      <circle cx="0" cy="0" r="4.6" fill="url(#gradCentro)"/>
      <circle cx="-1.4" cy="-1" r="0.55" fill="#5E3E1C"/>
      <circle cx="1.5" cy="0.3" r="0.55" fill="#5E3E1C"/>
      <circle cx="0.2" cy="1.8" r="0.55" fill="#5E3E1C"/>
      <circle cx="-1" cy="1.6" r="0.5" fill="#5E3E1C"/>`;
    return `
      <g class="girasol" data-orden="${indice}" transform="translate(${g.x},${g.y}) rotate(${g.r}) scale(${g.e})">
        ${petalos}
        ${semillas}
      </g>`;
  }

  function construirArbolSVG() {
    let copaHTML = "", girasolesHTML = "";

    copa.forEach((c, i) => {
      copaHTML += `<circle class="follaje" data-orden="${i}" cx="${c.x}" cy="${c.y}" r="${c.r}"/>`;
    });

    girasoles.forEach((g, i) => {
      girasolesHTML += crearGirasolSVG(g, i);
    });

    const svg = `
      <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="gradGlow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stop-color="#FBE27A" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#FBE27A" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="gradPetalo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FBE27A"/>
            <stop offset="100%" stop-color="#F5C331"/>
          </linearGradient>
          <radialGradient id="gradCentro" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stop-color="#A6753C"/>
            <stop offset="100%" stop-color="#8A5A2B"/>
          </radialGradient>
          <linearGradient id="gradTronco" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#7C5E3C"/>
            <stop offset="45%" stop-color="#9C7B54"/>
            <stop offset="100%" stop-color="#7C5E3C"/>
          </linearGradient>
        </defs>

        <circle class="resplandor" cx="200" cy="230" r="185" fill="url(#gradGlow)"/>

        <g class="grupo-arbol" id="grupo-arbol">
          <path class="tronco" id="tronco" fill="url(#gradTronco)" d="${troncoPath}"/>
          <g class="copa-grupo">${copaHTML}</g>
          <g class="listón-tronco" transform="translate(200,475)">
            <path d="M0,0 L-18,-13 L-5,0 L-18,13 Z" fill="#F3C9D4"/>
            <path d="M0,0 L18,-13 L5,0 L18,13 Z" fill="#F3C9D4"/>
            <circle cx="0" cy="0" r="5" fill="#E0A2B6"/>
          </g>
          ${girasolesHTML}
        </g>
      </svg>`;

    $("#contenedor-arbol").innerHTML = svg;
  }

  function animarArbol() {
    construirArbolSVG();

    const resplandor = $(".resplandor");
    const tronco = $("#tronco");
    const follajeEl = $$(".follaje");
    const girasolesEl = $$(".girasol");
    const listón = $(".listón-tronco");
    const grupo = $("#grupo-arbol");

    let t = 150;

    setTimeout(() => resplandor.classList.add("mostrar"), t);
    t += 400;

    setTimeout(() => tronco.classList.add("mostrar"), t);
    t += 1000;

    follajeEl.forEach((hoja, i) => {
      setTimeout(() => hoja.classList.add("mostrar"), t + i * 110);
    });
    t += follajeEl.length * 110 + 300;

    girasolesEl.forEach((flor, i) => {
      setTimeout(() => flor.classList.add("mostrar"), t + i * 85);
    });
    t += girasolesEl.length * 85 + 250;

    setTimeout(() => listón.classList.add("mostrar"), t);
    t += 500;

    setTimeout(() => grupo.classList.add("brisa"), t);
  }

  /* =======================================================
     Inicio de la experiencia
  ======================================================= */
  $("#btn-sorpresa").addEventListener("click", () => {
    intentarReproducir();
    const experiencia = $("#experiencia");
    experiencia.classList.add("visible");
    animarArbol();
    requestAnimationFrame(() => {
      experiencia.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

});