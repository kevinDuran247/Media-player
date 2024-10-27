const audio = document.getElementById('audio');
const progressBar = document.getElementById('progress-bar');
const customPlayButton = document.getElementById('custom-play');
const currentTimeElement = document.getElementById('current-time');
const progressThumb = document.getElementById('progress-thumb');

//////////////////////////////////PAUSA LA CANCION SI EL USUARIO SALE DE LA PAGINA/////////////////////////////////////
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        audio.pause(); // Pausa el audio si la pestaña se oculta
        customPlayButton.classList.remove('active'); // Remueve la clase 'active' del botón
    } else if (document.visibilityState === 'visible' && !audio.paused) {
        customPlayButton.classList.add('active'); // Añade la clase 'active' si la pestaña es visible y el audio está en reproducción
    }
});


////////////////////////////////////////////BOTON DE PLAY Y PAUSA///////////////////////////////////////////////////////
// Función que alterna entre reproducir y pausar el audio
const toggleAudio = () => {
    if (audio.paused) {
        audio.play(); // Reproduce el audio si está pausado
        customPlayButton.classList.add('active'); // Añade la clase 'active' al botón
    } else {
        audio.pause(); // Pausa el audio si está en reproducción
        customPlayButton.classList.remove('active'); // Remueve la clase 'active' del botón
    }
};
// Añade un evento de clic al botón de reproducción para llamar a la función toggleAudio
customPlayButton.addEventListener('click', toggleAudio);


//////////////////////////////////BARRA DE PROGRESO Y TIEMPO DE LA CANCION//////////////////////////////////////////////
let isDragging = false; // Variable para controlar si se está arrastrando la "chibolita"

// Función que se llama al iniciar el arrastre de la "chibolita"
const handleDragStart = () => {
    isDragging = true; // Cambia el estado a 'arrastrando'
    audio.pause(); // Pausa el audio mientras se arrastra
};

// Función que se llama mientras se arrastra la "chibolita"
const handleDragMove = (event) => {
    const progressContainer = document.querySelector('.progress-container'); // Obtiene el contenedor de progreso
    const width = progressContainer.clientWidth; // Obtiene el ancho del contenedor
    let offsetX; // Variable para almacenar la posición del clic/touch

    if (event.touches) {
        // Para dispositivos táctiles
        offsetX = event.touches[0].clientX - progressContainer.getBoundingClientRect().left; // Calcula la posición del toque
    } else {
        // Para dispositivos de escritorio
        offsetX = event.clientX - progressContainer.getBoundingClientRect().left; // Calcula la posición del clic
    }

    const newThumbPosition = Math.max(0, Math.min(offsetX, width)); // Limita la posición de la "chibolita" entre 0 y el ancho
    progressThumb.style.left = `${newThumbPosition}px`; // Actualiza la posición de la "chibolita"
    progressBar.style.width = `${(newThumbPosition / width) * 100}%`; // Actualiza el ancho de la barra de progreso

    // Calcula y actualiza el tiempo del audio basado en la posición de la "chibolita"
    const newTime = (newThumbPosition / width) * audio.duration;
    currentTimeElement.textContent = formatTime(newTime); // Formatea el tiempo y lo muestra
    audio.currentTime = newTime; // Actualiza el tiempo actual del audio
    customPlayButton.classList.add('active'); // Cambia el estado del botón a "play"
};

// Función que se llama al finalizar el arrastre de la "chibolita"
const handleDragEnd = () => {
    if (isDragging) {
        isDragging = false; // Cambia el estado a no arrastrando
        audio.play(); // Reanuda la reproducción del audio
    }
};

// Manejadores de eventos para iniciar el arrastre
progressThumb.addEventListener('mousedown', handleDragStart); // Para mouse
progressThumb.addEventListener('touchstart', handleDragStart); // Para dispositivos táctiles

// Manejadores de eventos para finalizar el arrastre
document.addEventListener('mouseup', handleDragEnd); // Para mouse
document.addEventListener('touchend', handleDragEnd); // Para dispositivos táctiles

// Manejadores de eventos para mover la "chibolita" mientras se arrastra
document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        handleDragMove(event); // Llama a la función de mover si se está arrastrando
    }
});

document.addEventListener('touchmove', (event) => {
    if (isDragging) {
        handleDragMove(event); // Llama a la función de mover si se está arrastrando
    }
});

// Manejador de eventos para hacer clic en la barra de progreso
const progressContainer = document.querySelector('.progress-container');

progressContainer.addEventListener('click', (event) => {
    const width = progressContainer.clientWidth; // Obtiene el ancho del contenedor
    const offsetX = event.clientX - progressContainer.getBoundingClientRect().left; // Calcula la posición del clic

    const newThumbPosition = Math.max(0, Math.min(offsetX, width)); // Limita la posición de la "chibolita" entre 0 y el ancho
    progressThumb.style.left = `${newThumbPosition}px`; // Actualiza la posición de la "chibolita"
    progressBar.style.width = `${(newThumbPosition / width) * 100}%`; // Actualiza el ancho de la barra de progreso

    const newTime = (newThumbPosition / width) * audio.duration; // Calcula el nuevo tiempo
    audio.currentTime = newTime; // Actualiza el tiempo actual del audio

    currentTimeElement.textContent = formatTime(audio.currentTime); // Formatea el tiempo actual y lo muestra

    if (audio.paused) {
        audio.play(); // Reproduce el audio si estaba pausado
        customPlayButton.classList.add('active'); // Cambia el estado del botón a "play"
    }
});

// Evento que se activa mientras se actualiza el tiempo del audio
audio.addEventListener('timeupdate', () => {
    if (!isDragging) { // Solo actualiza si no se está arrastrando
        const progressPercent = (audio.currentTime / audio.duration) * 100; // Calcula el porcentaje de progreso
        progressBar.style.width = `${progressPercent}%`; // Actualiza el ancho de la barra de progreso

        const progressContainerWidth = document.querySelector('.progress-container').clientWidth; // Obtiene el ancho del contenedor de progreso
        const thumbPosition = (progressContainerWidth * progressPercent) / 100; // Calcula la posición de la "chibolita"
        progressThumb.style.left = `${thumbPosition}px`; // Actualiza la posición de la "chibolita"

        currentTimeElement.textContent = formatTime(audio.currentTime); // Formatea el tiempo actual y lo muestra
    }
});

// Función para formatear el tiempo en formato MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60); // Calcula los minutos
    const remainingSeconds = Math.floor(seconds % 60); // Calcula los segundos restantes
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Devuelve el tiempo formateado
}
