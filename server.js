//import * as {fs} from 'fs';
//import OpenAI from "openai";
const {OpenAI} = require("openai");
const fs = require('fs');
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config()
const Stack = require('./stack');
const Queue = require('./queue');
const { time } = require("console");


const PORT = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);
const openai = new OpenAI({apikey:process.env.OPENAI_APIKEY});
var stack = new Stack();
var queue = new Queue();

console.log("Check if the queue is empty")
console.log(queue.isEmpty());

io.on('connection',(socket) => {
  console.log('Cliente conectado');

  socket.on('start', (filename) => {
    console.log('Grabación iniciada: ' + filename);
    const audioStream = fs.createWriteStream(`${filename}.wav`)
    //transcribe2 transcribe
    //const transcriptionStream =  transcribe()
    //const transcriptionStream =  transcribe(data)

    socket.on('data',(data) => {
      try {
        // audioStream.write(data);
        // transcriptionStream.write(data);
        //stack.push(data);
        setTimeout(() =>{
          const audioBuffer = Buffer.from(data, 'base64');
          // Guardar el archivo de audio
          const filePath = `./audio/${Date.now()}.wav`;
          fs.writeFile(filePath, audioBuffer, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('Audio file saved successfully');
            }
          });
          transcribe(filePath);  
          if (data) {
            console.log('Transcript: ' + filePath);
            socket.emit('transcript', filePath);
          } else{
            console.log("No se recibió el audio");
          }
          // transcribe(data).on('data', (transcript) => {
          //   if (transcript) {
          //     console.log('Transcript: ' + transcript);
          //     socket.emit('transcript', transcript);
          //   } else{
          //     console.log("No se recibió el audio");
          //   }
          // });
        },15000);
        //transcribe(data);
        // queue.send(data);
        // while (stack.length < 0){
        //   transcribe(queue.receive);
        // }
        // transcribe(data).on('data', (transcript) => {
        //   if (transcript) {
        //     console.log('Transcript: ' + transcript);
        //     socket.emit('transcript', transcript);
        //   } else{
        //     console.log("No se recibió el audio");
        //   }
        // });
      } catch (error) {
        console.log(error);
        socket.emit('error: ',error.message);
      }
    })

    socket.on('stop', () => {
      console.log('Grabación finalizada');
      audioStream.end();;
    });
  });

  socket.on('disconnect', () => {
    console.log('Client desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

async function transcribe(audio) {
  try {
    return await openai.audio.transcriptions.create({
      model: "whisper-1",
      language: "es",
      file: audio
    });
  } catch (error) {
    console.log(error);
  }
}

// async function transcribe2() {
//   return await openai.audio.transcriptions.create({
//     model: "whisper-1",
//     language: "es",
//   });
// }



