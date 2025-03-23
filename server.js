// Importar módulos necesarios
const express = require('express'); // Framework para crear el servidor web
const http = require('http'); // Módulo para crear un servidor HTTP
const socketIo = require('socket.io'); // Módulo para manejar conexiones en tiempo real
const path = require('path'); // Módulo para manejar rutas de archivos

// Importar el controlador de usuarios (archivo: controllers/usuarioController.js)
const usuarioController = require('./controllers/usuarioController');

// Crear una instancia de Express y un servidor HTTP
const app = express();
const server = http.createServer(app);

// Inicializar Socket.IO y vincularlo al servidor HTTP
const io = socketIo(server);

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('private'));

// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Obtener la lista de usuarios usando la función 'leerUsuarios' del controlador
    // (Definida en: controllers/usuarioController.js)
    const usuarios = usuarioController.leerUsuarios();

    // Enviar la lista de usuarios al cliente que se acaba de conectar
    // (El cliente escucha este evento en: public/script.js)
    socket.emit('usuarios', usuarios);

    // Escuchar el evento 'nuevoUsuario' desde el cliente
    // (El cliente emite este evento en: public/script.js)
    socket.on('nuevoUsuario', (nuevoUsuario) => {
        // Agregar el nuevo usuario usando la función 'agregarUsuario' del controlador
        // (Definida en: controllers/usuarioController.js)
        const usuarioAgregado = usuarioController.agregarUsuario(nuevoUsuario);

        // Emitir el nuevo usuario a todos los clientes conectados
        // (Los clientes escuchan este evento en: public/script.js)
        io.emit('nuevoUsuario', usuarioAgregado);
    });

    // Manejar la desconexión de un cliente
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});

// Definir el puerto en el que correrá el servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});