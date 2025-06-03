// Inicializa el mapa
document.addEventListener('DOMContentLoaded', () => {
  const mapa = L.map('mapaLoja').setView([-3.9931, -79.2033], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapa);

  const lugares = [
    { nombre: "Parque Jipiro", coords: [-3.978, -79.202] },
    { nombre: "Puerta de la Ciudad", coords: [-3.990, -79.204] },
    { nombre: "Museo de la Música", coords: [-3.995, -79.207] }
  ];

  lugares.forEach(lugar => {
    L.marker(lugar.coords)
      .addTo(mapa)
      .bindPopup(`<b>${lugar.nombre}</b>`);
  });
});



// Carrusel de imágenes
const carruselSlide = document.querySelector('.carrusel-slide');
const imagenes = document.querySelectorAll('.carrusel-slide img');
const dotsContainer = document.querySelector('.carrusel-dots');

let indiceActual = 0;
let intervalo;

// Crear botones puntos según número de imágenes
imagenes.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dotsContainer.appendChild(dot);

  dot.addEventListener('click', () => {
    indiceActual = i;
    actualizarCarrusel();
    reiniciarIntervalo();
  });
});

function actualizarCarrusel() {
  const ancho = imagenes[0].clientWidth;
  carruselSlide.style.transform = `translateX(${-ancho * indiceActual}px)`;

  // Actualizar clases active en puntos
  const dots = dotsContainer.querySelectorAll('button');
  dots.forEach(dot => dot.classList.remove('active'));
  dots[indiceActual].classList.add('active');
}

function siguienteImagen() {
  indiceActual++;
  if (indiceActual >= imagenes.length) {
    indiceActual = 0;
  }
  actualizarCarrusel();
}

function reiniciarIntervalo() {
  clearInterval(intervalo);
  intervalo = setInterval(siguienteImagen, 5000);
}

// Iniciar el intervalo al cargar la página
intervalo = setInterval(siguienteImagen, 5000);

window.addEventListener('resize', () => {
  actualizarCarrusel();
});

// Buscador corregido

const parroquias = [
  { nombre: "El Sagrario", url: "parroquias/urbanas/el_sagrario.html" },
  { nombre: "Sucre", url: "parroquias/urbanas/sucre.html" },
  { nombre: "El Valle", url: "parroquias/urbanas/el_valle.html" },
  { nombre: "San Sebastián", url: "parroquias/urbanas/san_sebastian.html" },
  { nombre: "Punzara", url: "parroquias/urbanas/punzara.html" },
  { nombre: "Carigán", url: "parroquias/urbanas/carigan.html" },
  { nombre: "Chantaco", url: "parroquias/rurales/chantaco.html" },
  { nombre: "Chuquiribamba", url: "parroquias/rurales/chuquiribamba.html" },
  { nombre: "El Cisne", url: "parroquias/rurales/el_cisne.html" },
  { nombre: "Gualel", url: "parroquias/rurales/gualel.html" },
  { nombre: "Jimbilla", url: "parroquias/rurales/jimbilla.html" },
  { nombre: "Malacatos", url: "parroquias/rurales/malacatos.html" },
  { nombre: "Quinara", url: "parroquias/rurales/quinara.html" },
  { nombre: "San Lucas", url: "parroquias/rurales/san_lucas.html" },
  { nombre: "San Pedro de Vilcabamba", url: "parroquias/rurales/san_pedro_de_vilcabamba.html" },
  { nombre: "Santiago", url: "parroquias/rurales/santiago.html" },
  { nombre: "Taquil", url: "parroquias/rurales/taquil.html" },
  { nombre: "Vilcabamba", url: "parroquias/rurales/vilcabamba.html" },
  { nombre: "Yangana", url: "parroquias/rurales/yangana.html" }
];

const input = document.getElementById('buscador');
const lista = document.getElementById('listaparroquias');

lista.classList.add("hidden");

function mostrarResultados(filtrados) {
  lista.innerHTML = '';
  if (filtrados.length === 0) {
    lista.innerHTML = '<li>No se encontraron lugares.</li>';
    return;
  }

  filtrados.forEach(lugar => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = lugar.nombre;
    a.href = lugar.url;
    a.style.textDecoration = 'none';
    a.style.color = 'inherit';
    li.appendChild(a);
    lista.appendChild(li);
  });
}

input.addEventListener('input', () => {
  const texto = input.value.toLowerCase().trim();
  if (texto === '') {
    lista.classList.add('hidden');
    lista.innerHTML = '';
    return;
  }

  const filtrados = parroquias.filter(lugar =>
    lugar.nombre.toLowerCase().includes(texto)
  );

  lista.classList.remove('hidden');
  mostrarResultados(filtrados);
});

document.addEventListener('click', function (event) {
  if (!input.contains(event.target) && !lista.contains(event.target)) {
    lista.classList.add('hidden');
  }
});


// Chat BOT

const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

// Cerrar chatbot al hacer clic fuera
document.addEventListener('click', function (event) {
  if (
    !chatbotWindow.classList.contains('hidden') &&
    !chatbotWindow.contains(event.target) &&
    !chatbotIcon.contains(event.target)
  ) {
    chatbotWindow.classList.add('hidden');
  }
});

// Palabras clave y respuestas para Fuse.js
const keywords = [
  { key: 'hola', response: '¡Hola! ¿En qué puedo ayudarte sobre los lugares turísticos de Loja?' },
  { key: 'buenos días', response: '¡Hola! ¿En qué puedo ayudarte sobre los lugares turísticos de Loja?' },
  { key: 'buenas tardes', response: '¡Hola! ¿En qué puedo ayudarte sobre los lugares turísticos de Loja?' },
  { key: 'buenas noches', response: '¡Hola! ¿En qué puedo ayudarte sobre los lugares turísticos de Loja?' },
  
  { key: 'gracias', response: '¡Con gusto! Si tienes más preguntas, aquí estaré para ayudarte.' },
  { key: 'muchas gracias', response: '¡Con gusto! Si tienes más preguntas, aquí estaré para ayudarte.' },
  { key: 'agradecido', response: '¡Con gusto! Si tienes más preguntas, aquí estaré para ayudarte.' },
  
  { key: 'horario', response: 'El horario de atención suele ser de 9:00 a 18:00 horas, pero depende del lugar. ¿Quieres saber el horario de algún lugar en específico?' },
  { key: 'abierto', response: 'El horario de atención suele ser de 9:00 a 18:00 horas, pero depende del lugar. ¿Quieres saber el horario de algún lugar en específico?' },
  { key: 'cerrado', response: 'El horario de atención suele ser de 9:00 a 18:00 horas, pero depende del lugar. ¿Quieres saber el horario de algún lugar en específico?' },
  { key: 'hora', response: 'El horario de atención suele ser de 9:00 a 18:00 horas, pero depende del lugar. ¿Quieres saber el horario de algún lugar en específico?' },
  
  { key: 'ubicación', response: '¿Sobre qué lugar quieres saber la ubicación exacta? Puedo ayudarte con eso.' },
  { key: 'dónde', response: '¿Sobre qué lugar quieres saber la ubicación exacta? Puedo ayudarte con eso.' },
  { key: 'localización', response: '¿Sobre qué lugar quieres saber la ubicación exacta? Puedo ayudarte con eso.' },
  { key: 'dirección', response: '¿Sobre qué lugar quieres saber la ubicación exacta? Puedo ayudarte con eso.' },
  
  { key: 'precio', response: 'Los precios de entrada varían según el lugar, algunos son gratuitos y otros tienen un costo accesible.' },
  { key: 'costo', response: 'Los precios de entrada varían según el lugar, algunos son gratuitos y otros tienen un costo accesible.' },
  { key: 'entrada', response: 'Los precios de entrada varían según el lugar, algunos son gratuitos y otros tienen un costo accesible.' },
  { key: 'valor', response: 'Los precios de entrada varían según el lugar, algunos son gratuitos y otros tienen un costo accesible.' },
  
  { key: 'qué hacer', response: 'En Loja puedes disfrutar de caminatas, visitas culturales, gastronomía local y mucho más. ¿Quieres recomendaciones específicas?' },
  { key: 'actividades', response: 'En Loja puedes disfrutar de caminatas, visitas culturales, gastronomía local y mucho más. ¿Quieres recomendaciones específicas?' },
  { key: 'recomendaciones', response: 'En Loja puedes disfrutar de caminatas, visitas culturales, gastronomía local y mucho más. ¿Quieres recomendaciones específicas?' },
  { key: 'plan', response: 'En Loja puedes disfrutar de caminatas, visitas culturales, gastronomía local y mucho más. ¿Quieres recomendaciones específicas?' },
  
  { key: 'clima', response: 'El clima en Loja es generalmente templado, ideal para actividades al aire libre. ¿Quieres saber el clima actual?' },
  { key: 'tiempo', response: 'El clima en Loja es generalmente templado, ideal para actividades al aire libre. ¿Quieres saber el clima actual?' },
  { key: 'temperatura', response: 'El clima en Loja es generalmente templado, ideal para actividades al aire libre. ¿Quieres saber el clima actual?' },
  
  { key: 'cómo llegar', response: 'Para llegar a los lugares turísticos puedes usar taxis, buses locales o transporte privado. ¿Necesitas ayuda con una ruta específica?' },
  { key: 'transporte', response: 'Para llegar a los lugares turísticos puedes usar taxis, buses locales o transporte privado. ¿Necesitas ayuda con una ruta específica?' },
  { key: 'bus', response: 'Para llegar a los lugares turísticos puedes usar taxis, buses locales o transporte privado. ¿Necesitas ayuda con una ruta específica?' },
  { key: 'taxi', response: 'Para llegar a los lugares turísticos puedes usar taxis, buses locales o transporte privado. ¿Necesitas ayuda con una ruta específica?' },
  
  { key: 'comida', response: 'La gastronomía de Loja es deliciosa, con platos típicos como el repe lojano, la cecina y el hornado. ¿Quieres recomendaciones de restaurantes?' },
  { key: 'restaurantes', response: 'La gastronomía de Loja es deliciosa, con platos típicos como el repe lojano, la cecina y el hornado. ¿Quieres recomendaciones de restaurantes?' },
  { key: 'dónde comer', response: 'La gastronomía de Loja es deliciosa, con platos típicos como el repe lojano, la cecina y el hornado. ¿Quieres recomendaciones de restaurantes?' },
  { key: 'platos típicos', response: 'La gastronomía de Loja es deliciosa, con platos típicos como el repe lojano, la cecina y el hornado. ¿Quieres recomendaciones de restaurantes?' },
  
  { key: 'adiós', response: '¡Hasta luego! Espero haberte ayudado. Vuelve cuando quieras para más información.' },
  { key: 'hasta luego', response: '¡Hasta luego! Espero haberte ayudado. Vuelve cuando quieras para más información.' },
  { key: 'nos vemos', response: '¡Hasta luego! Espero haberte ayudado. Vuelve cuando quieras para más información.' },
];


// Configuración Fuse.js
const fuseOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: ['key']
};

const fuse = new Fuse(keywords, fuseOptions);

chatbotIcon.addEventListener('click', () => {
  chatbotWindow.classList.toggle('hidden');
  if (!chatbotWindow.classList.contains('hidden')) {
    chatbotInput.focus();
  }
});

chatbotClose.addEventListener('click', () => {
  chatbotWindow.classList.add('hidden');
});

chatbotForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let userMessage = chatbotInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, 'user');
  chatbotInput.value = '';
  
  // Corregir ortografía con API LanguageTool (gratuita, límite 20k chars/día)
  userMessage = await correctSpelling(userMessage);

  respondToUser(userMessage);
});

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function respondToUser(userText) {
  setTimeout(() => {
    const response = generateResponse(userText);
    addMessage(response, 'bot');
  }, 500);
}

function generateResponse(text) {
  const searchResult = fuse.search(text.toLowerCase());
  if (searchResult.length > 0) {
    return searchResult[0].item.response;
  }
  return 'Le rindo mis disculpas, no tengo información sobre ese lugar.';
}

// Función para corregir ortografía con LanguageTool API
async function correctSpelling(text) {
  try {
    const res = await fetch('https://api.languagetoolplus.com/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: text,
        language: 'es',
      }),
    });
    const data = await res.json();
    if (data && data.matches && data.matches.length > 0) {
      // Reemplazar los errores encontrados con la primera sugerencia
      let correctedText = text;
      // Ordenar de último a primero para no alterar los indices
      const matches = data.matches.sort((a,b) => b.offset - a.offset);
      for (const match of matches) {
        if (match.replacements && match.replacements.length > 0) {
          correctedText = correctedText.slice(0, match.offset) +
            match.replacements[0].value +
            correctedText.slice(match.offset + match.length);
        }
      }
      return correctedText;
    }
  } catch (error) {
    console.error('Error en corrección ortográfica:', error);
  }
  return text; // Si falla la corrección, usar el texto original
}

let lastIntent = null;  // Guardamos la última intención detectada


function respondToUser(userText) {
  setTimeout(() => {
    const { response, intent } = generateResponseWithIntent(userText);
    addMessage(response, 'bot');
    lastIntent = intent;  // Actualizamos el contexto
  }, 500);
}

// Nueva función para obtener respuesta y guardar intención
function generateResponseWithIntent(text) {
  const textLower = text.toLowerCase().trim();

  // Primero buscamos coincidencia fuzzy
  const searchResult = fuse.search(textLower);

  // Manejo de respuestas cortas tipo "sí" o "no" en contexto
  if ((textLower === 'sí' || textLower === 'si') && lastIntent) {
    if (lastIntent === 'horario') {
      return { response: 'Perfecto, dime el lugar del que quieres saber el horario.', intent: 'horario_confirmacion' };
    }
    return { response: `Muy bien, cuéntame más sobre lo que quieres saber acerca de ${lastIntent}.`, intent: lastIntent };
  }

  if (textLower === 'no' && lastIntent) {
    if (lastIntent === 'horario') {
      return { response: 'Entendido, dime en qué más puedo ayudarte.', intent: null };
    }
    return { response: 'Está bien, dime si tienes otra pregunta o quieres saber de otro tema.', intent: null };
  }

  // Si encontró coincidencia fuzzy, responder con la respuesta relacionada
  if (searchResult.length > 0) {
    const intent = searchResult[0].item.key;
    const response = searchResult[0].item.response;
    return { response, intent };
  }

  // Si no encontró nada, responder de forma natural y abierta
  return {
    response: 'No estoy seguro de esa consulta, pero puedes preguntarme sobre lugares turísticos, horarios, precios, o recomendaciones en Loja.',
    intent: null
  };
}
