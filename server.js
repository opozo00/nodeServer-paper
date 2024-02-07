//import * as {fs} from 'fs';
//import OpenAI from "openai";
const {OpenAI} = require("openai");
const fs = require('fs');
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');


const PORT = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);
const openai = new OpenAI({apiKey:"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"});

async function transcribirAudio (audio) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audio),
    model: "whisper-1",
    language: "es",
  });

  console.log(transcription.text);
  return transcription;
}
transcribirAudio('audio.wav');

//Prueba de servidor
app.get('/prueba', function(req, res){
  res.json({mensaje:'Hola Mundo'})
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejar eventos de mensajes
  socket.on('message', (data) => {
    console.log('Mensaje recibido : '+ data);
    // Emitir el mensaje a todos los clientes conectados
    io.emit('message', 'Te saludos desde nodejs');
  });

  socket.on('transcription',(data)=>{
    // Convertir el buffer de audio recibido a formato compatible con Whisper
    const audioBuffer = Buffer.from(data);
    transcribirAudio(audioBuffer).then((result)=>{
      //Envio de transcripcion
      socket.emit('transcript', result.text);
    });
  });

  // Manejar evento de desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
