const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 3000;

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejar eventos de mensajes
  socket.on('message', (data) => {
    console.log('Mensaje recibido : '+ data);
    // Emitir el mensaje a todos los clientes conectados
    io.emit('message', data);
  });

  // Manejar evento de desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
