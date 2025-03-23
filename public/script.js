// Conectar al servidor de Socket.IO
// (Socket.IO se inicializa en: server.js)
const socket = io();

// Obtener referencias a los elementos del DOM
const listaUsuarios = document.getElementById('lista-usuarios');
const formUsuario = document.getElementById('form-usuario');

// Escuchar el evento 'usuarios' desde el servidor
// (El servidor emite este evento en: server.js)
socket.on('usuarios', (usuarios) => {
    // Limpiar la lista actual de usuarios
    listaUsuarios.innerHTML = '';

    // Recorrer el array de usuarios y agregarlos a la lista
    usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.textContent = `${usuario.nombre} - ${usuario.email}`;
        listaUsuarios.appendChild(li);
    });
});

// Escuchar el evento 'nuevoUsuario' desde el servidor
// (El servidor emite este evento en: server.js)
socket.on('nuevoUsuario', (nuevoUsuario) => {
    // Crear un nuevo elemento de lista para el usuario
    const li = document.createElement('li');
    li.textContent = `${nuevoUsuario.nombre} - ${nuevoUsuario.email}`;

    // Agregar el nuevo usuario a la lista
    listaUsuarios.appendChild(li);
});

// Escuchar el envío del formulario
formUsuario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    // Crear un objeto con el nuevo usuario
    const nuevoUsuario = { nombre, email };

    // Emitir el nuevo usuario al servidor a través de Socket.IO
    // (El servidor escucha este evento en: server.js)
    socket.emit('nuevoUsuario', nuevoUsuario);

    // Limpiar el formulario después de enviar
    formUsuario.reset();
});