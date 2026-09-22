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

  function actualizarMusica() {
    const activa = !musica.paused;
    btnMusica.classList.toggle("silenciado", !activa);
    btnMusica.querySelector("span").textContent = activa ? "Pausar música" : "Escuchar música";
    btnMusica.setAttribute("aria-label", activa ? "Pausar música" : "Escuchar música");
  }
  musica.addEventListener("play", actualizarMusica);
  musica.addEventListener("pause", actualizarMusica);
  actualizarMusica();

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

  const movimientoReducido = matchMedia("(prefers-reduced-motion: reduce)");
  let pausarMovimiento = movimientoReducido.matches;
  const btnMovimiento = $("#btn-movimiento");
  function actualizarBotonMovimiento() {
    btnMovimiento.querySelector(".icono-control").textContent = pausarMovimiento ? "▶" : "Ⅱ";
    btnMovimiento.querySelector(".etiqueta-control").textContent = pausarMovimiento ? "Reanudar movimiento" : "Pausar movimiento";
  }
  actualizarBotonMovimiento();
  const frases = ["Te amo", "Siempre Juntos", "Mi abominación bella", "Mi papoi",
    "Te extraño mucho", "Mi lugar favorito eres tú", "Qué bonito coincidir contigo",
    "Tú, en todos mis días", "Un girasol por cada te amo",
    "Te elegiría otra vez", "Eres mi alegría bonita", "Contigo, todo es más bonito",
    "Mi abrazo favorito", "Me haces tanta falta", "Qué suerte tenerte",
    "Te pienso y sonrío", "Mi bonita casualidad", "Me encantas, chiquita",
    "Ojalá abrazarte ahora", "Siempre cerquita de ti", "Te quiero en mis mañanas",
    "Mi persona favorita", "Tu sonrisa me ilumina", "Un besito hasta donde estés",
    "Mi amor bonito", "Contigo me quedo", "Eres mi hogar", "Me haces bien",
    "Tengo un abrazo pendiente", "Gracias por existir", "Tú haces bonito mi mundo",
    "Te amo un poquito más hoy"];
  const raices = [
    {x:125, y:575}, {x:210, y:595}, {x:300, y:580},
    {x:390, y:595}, {x:475, y:575}
  ];
  let bolsaFrases = [];
  const NS = "http://www.w3.org/2000/svg";
  let ramas = [], svg, raiz, capaFrases, cuadro = 0, tiempo = 0, anterior = null;
  let proximaFrase = 7, ultimaFrase = -1, mensajes = [], enPantalla = true;
  const azar = (min, max) => min + Math.random() * (max - min);
  const limitar = (n, min, max) => Math.min(max, Math.max(min, n));
  const suave = n => n * n * (3 - 2 * n);

  function nodo(nombre, atributos, padre) {
    const elemento = document.createElementNS(NS, nombre);
    Object.entries(atributos).forEach(([clave, valor]) => elemento.setAttribute(clave, valor));
    padre.appendChild(elemento);
    return elemento;
  }

  function construirArbolSVG() {
    const contenedor = $("#contenedor-arbol");
    contenedor.innerHTML = `<svg viewBox="0 0 600 700" role="img" aria-labelledby="jardin-titulo jardin-descripcion">
      <title id="jardin-titulo">Girasoles para Yaira</title>
      <desc id="jardin-descripcion">Un jardín de girasoles nace de varias raíces y se mece con el viento.</desc>
      <defs>
        <radialGradient id="halo"><stop stop-color="#f9df81" stop-opacity=".38"/><stop offset="1" stop-color="#f9df81" stop-opacity="0"/></radialGradient>
        <linearGradient id="petalo" x2=".3" y2="1"><stop stop-color="#fff09a"/><stop offset=".5" stop-color="#f9cc38"/><stop offset="1" stop-color="#dc9518"/></linearGradient>
        <radialGradient id="semilla"><stop stop-color="#a36b30"/><stop offset=".65" stop-color="#754721"/><stop offset="1" stop-color="#51351f"/></radialGradient>
        <g id="flor-modelo">${Array.from({length: 24}, (_, i) => `<path d="M0 -6 C-8 -12 -6 -23 0 -27 C6 -22 8 -12 0 -6Z" fill="url(#petalo)" transform="rotate(${i * 30 + (i > 11 ? 15 : 0)}) scale(${i > 11 ? .83 : 1})"/>`).join("")}
          <circle r="9" fill="url(#semilla)"/>
          ${Array.from({length: 35}, (_, i) => { const a = i * 2.39996, r = Math.sqrt(i / 35) * 7.7; return `<circle cx="${Math.cos(a)*r}" cy="${Math.sin(a)*r}" r=".65" fill="#e6b55f" opacity=".65"/>`; }).join("")}
        </g>
        <g id="hoja-modelo"><path d="M0 0 C-4 -19 13 -34 24 -37 C28 -17 18 -2 0 0" fill="currentColor"/><path d="M0 0 Q11 -14 21 -31" fill="none" stroke="#c4d097" stroke-width=".7" opacity=".65"/></g>
      </defs>
      <ellipse cx="300" cy="300" rx="295" ry="300" fill="url(#halo)"/>
      <ellipse cx="300" cy="635" rx="225" ry="14" fill="#748352" opacity=".10"/>
      <g id="raiz-jardin" fill="none" stroke="#8d784b" stroke-linecap="round" stroke-width="3" pathLength="1">
        ${raices.map(r => `<path class="raiz-planta" d="M${r.x} ${r.y} q-3 25 0 43 m-1 -18 q-15 15 -30 21 m30 -17 q15 8 28 23 m-27 -12 l-12 18 m19 -25 l10 23"/>`).join("")}
      </g>
      <g id="tallos-jardin"></g><g id="flores-jardin"></g><g id="frases-jardin" aria-hidden="true"></g>
    </svg>`;
    svg = contenedor.querySelector("svg");
    raiz = svg.querySelector("#raiz-jardin");
    capaFrases = svg.querySelector("#frases-jardin");
    const tallos = svg.querySelector("#tallos-jardin");
    const flores = svg.querySelector("#flores-jardin");
    // Distribución de girasol: llena una elipse sin formar filas artificiales.
    ramas = Array.from({length: 120}, (_, i) => {
      const a = i * Math.PI * (3 - Math.sqrt(5));
      const radio = Math.sqrt((i + .5) / 120);
      const x = 300 + Math.cos(a) * radio * 226;
      const origen = raices[limitar(Math.floor((x - 60) / 96), 0, raices.length - 1)];
      return {x, y: 290 + Math.sin(a) * radio * 210, origen,
        escala: azar(.58, .94), fase: azar(0, Math.PI * 2), flexibilidad: azar(.8, 1.25), retraso: azar(.65, 4.8),
        duracion: azar(2.4, 3.8), desplazamiento: 0, velocidad: 0, giro: azar(-16,16)};
    }).sort((a,b) => a.y - b.y);
    ramas.forEach(r => {
      r.camino = nodo("path", {fill:"none", stroke: r.y < 260 ? "#899966" : "#657e48", "stroke-width": azar(1.5, 2.7), "stroke-linecap":"round", pathLength:1}, tallos);
      r.hojas = [0,1].map(i => nodo("use", {href:"#hoja-modelo", color: i ? "#718b51" : "#91a76b"}, tallos));
      // La posición vive en un grupo y la apertura en otro: no se pisan sus transforms.
      r.cabeza = nodo("g", {class:"flor-posicion"}, flores);
      r.flor = nodo("use", {href:"#flor-modelo"}, r.cabeza);
    });
  }

  function fraseNueva() {
    const disponibles = ramas.filter(r => pausarMovimiento || tiempo > r.retraso + r.duracion + .6);
    if (!disponibles.length || mensajes.length >= 2) return;
    const r = disponibles[Math.floor(Math.random() * disponibles.length)];
    if (!bolsaFrases.length) {
      bolsaFrases = frases.map((_, i) => i);
      for (let i = bolsaFrases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bolsaFrases[i], bolsaFrases[j]] = [bolsaFrases[j], bolsaFrases[i]];
      }
      if (bolsaFrases[bolsaFrases.length - 1] === ultimaFrase) {
        [bolsaFrases[0], bolsaFrases[bolsaFrases.length - 1]] = [bolsaFrases[bolsaFrases.length - 1], bolsaFrases[0]];
      }
    }
    const indice = bolsaFrases.pop();
    ultimaFrase = indice;
    const grupo = nodo("g", {class:"frase-flor", opacity:0}, capaFrases);
    const ancho = Math.min(340, frases[indice].length * 9 + 34);
    nodo("rect", {x:-ancho/2, y:-22, width:ancho, height:38, rx:19, fill:"#fffdf6", "fill-opacity":.95, stroke:"#ead9ad", "stroke-width":1}, grupo);
    nodo("text", {"text-anchor":"middle", y:3}, grupo).textContent = frases[indice];
    mensajes.push({grupo, inicio:tiempo, x:limitar(r.x, ancho/2 + 15, 585-ancho/2), y:Math.max(100, r.y - 30)});
  }

  function dibujar(dt) {
    const reducido = pausarMovimiento;
    raiz.style.opacity = reducido ? 1 : suave(limitar(tiempo / .9, 0, 1));
    ramas.forEach(r => {
      const crecimiento = reducido ? 1 : suave(limitar((tiempo-r.retraso)/r.duracion, 0, 1));
      // Resorte amortiguado: ráfagas compartidas y respuesta distinta en cada tallo.
      const viento = reducido ? 0 : Math.sin(tiempo*.9-r.x*.004)*12 + Math.sin(tiempo*1.65 + r.fase)*6 + Math.pow(Math.max(0, Math.sin(tiempo*.38)), 4)*12;
      const objetivo = viento * (650-r.y)/490 * r.flexibilidad;
      r.velocidad += ((objetivo-r.desplazamiento)*11-r.velocidad*3.8)*dt;
      r.desplazamiento += r.velocidad*dt;
      if (reducido) { r.desplazamiento = 0; r.velocidad = 0; }
      const x = r.x+r.desplazamiento;
      const y = r.y + (reducido ? 0 : Math.sin(tiempo*1.8+r.fase)*2.4) + Math.abs(r.desplazamiento)*.08;
      const cx = r.origen.x+(r.x-r.origen.x)*.22+r.desplazamiento*.35, cy = r.origen.y-100;
      r.camino.setAttribute("d", `M${r.origen.x} ${r.origen.y} Q${cx} ${cy} ${x} ${y}`);
      r.camino.style.strokeDasharray = "1";
      r.camino.style.strokeDashoffset = 1-crecimiento;
      r.camino.style.opacity = crecimiento > 0 ? 1 : 0;
      r.hojas.forEach((hoja,i) => {
        const t = .44+i*.27, u = 1-t;
        const hx = u*u*r.origen.x+2*u*t*cx+t*t*x, hy = u*u*r.origen.y+2*u*t*cy+t*t*y;
        const apertura = limitar((crecimiento-t)/.2, 0, 1);
        hoja.setAttribute("transform", `translate(${hx} ${hy}) rotate(${(i ? 35 : -65)+r.desplazamiento*.85}) scale(${(i ? 1 : -1)*apertura*.8} ${apertura*.8})`);
      });
      const apertura = reducido ? 1 : suave(limitar((tiempo-r.retraso-r.duracion)/.85, 0, 1));
      r.cabeza.setAttribute("transform", `translate(${x} ${y}) rotate(${r.giro+r.desplazamiento*1.35})`);
      r.flor.setAttribute("transform", `scale(${r.escala*apertura})`);
      r.flor.style.opacity = apertura;
    });
    if (!reducido && tiempo > proximaFrase) {
      fraseNueva();
      proximaFrase = tiempo + azar(3, 4.8);
    }
    if (reducido && !mensajes.length) fraseNueva();
    mensajes = mensajes.filter(m => {
      const edad = reducido ? 1 : tiempo-m.inicio;
      if (edad > 5.8) { m.grupo.remove(); return false; }
      m.grupo.setAttribute("transform", `translate(${m.x+Math.sin(edad)*3} ${m.y-edad*9})`);
      m.grupo.setAttribute("opacity", Math.min(1, edad/.8, (5.8-edad)/1.3));
      return true;
    });
  }

  function actualizar(ahora) {
    cuadro = 0;
    const dt = anterior === null ? 0 : Math.min((ahora-anterior)/1000, .04);
    anterior = ahora;
    tiempo += dt;
    dibujar(dt);
    if (!pausarMovimiento && !document.hidden && enPantalla) cuadro = requestAnimationFrame(actualizar);
  }

  function reanudar() {
    cancelAnimationFrame(cuadro);
    anterior = null;
    if (svg && !pausarMovimiento && !document.hidden && enPantalla) cuadro = requestAnimationFrame(actualizar);
  }
  document.addEventListener("visibilitychange", reanudar);
  movimientoReducido.addEventListener("change", () => {
    pausarMovimiento = movimientoReducido.matches;
    actualizarBotonMovimiento();
    mensajes.forEach(m => m.grupo.remove()); mensajes = [];
    reanudar();
  });
  new IntersectionObserver(([entrada]) => { enPantalla = entrada.isIntersecting; reanudar(); }).observe($(".escena-flores"));

  function animarArbol() {
    cancelAnimationFrame(cuadro);
    tiempo = pausarMovimiento ? 9 : 0; anterior = null; mensajes = []; proximaFrase = 7;
    construirArbolSVG();
    dibujar(0);
    reanudar();
  }
  btnMovimiento.addEventListener("click", () => {
    pausarMovimiento = !pausarMovimiento;
    actualizarBotonMovimiento();
    reanudar();
  });
  $("#btn-repetir").addEventListener("click", () => {
    pausarMovimiento = false;
    actualizarBotonMovimiento();
    animarArbol();
  });

  /* =======================================================
     Inicio de la experiencia
  ======================================================= */
  $("#btn-sorpresa").addEventListener("click", () => {
    $("#intro").hidden = true;
    intentarReproducir();
    const experiencia = $("#experiencia");
    experiencia.classList.add("visible");
    animarArbol();
    requestAnimationFrame(() => {
      experiencia.scrollIntoView({ behavior: movimientoReducido.matches ? "instant" : "smooth", block: "start" });
    });
  });

});