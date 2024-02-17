//import * as {fs} from 'fs';
//import OpenAI from "openai";
const { OpenAI } = require("openai");
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
const openai = new OpenAI({ apikey: process.env.OPENAI_APIKEY });
var stack = new Stack();
var queue = new Queue();

// console.log("Check if the queue is empty")
// console.log(queue.isEmpty());


// async function main() {
//   while (queue.length() < 3) {
//     queue.send('audio.wav');
//   }
//   console.log("PRINT DE LA COLA");
//   //queue.printQueue();
//   console.log(queue.printQueue());
//   const fileAUDIO = 'audio.wav'
//   while (queue.isEmpty != false) {
//     const transcription = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(queue.receive()),
//       //file: fs.createReadStream(fileAUDIO),
//       model: "whisper-1",
//     });

//     console.log(transcription.text);
//     console.log("PRINT DE LA COLA");
//     //queue.printQueue();
//     console.log(queue.printQueue());

//   }
//   console.log("Check if the queue is empty")
//   console.log(queue.isEmpty());
// }
// main();


io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('start', (filename) => {
    console.log('Grabación iniciada: ' + filename);
    const audioStream = fs.createWriteStream(filename)
    console.log("Este es el archivo de audio recibido desde el cliente: ", audioStream)

    socket.on('data', (data) => {
      audioStream.write(data);
      setTimeout(() => {
        queue.send(audioStream);
        //transcribe2(audioStream.path);
        console.log("TAMAÑO DE LA COLA >>> ", queue.length());
        console.log("TIPO DE DATO >>> ", audioStream.path);
        console.log("TAMAÑO DE LA GRABACIÓN >>>", audioStream.bytesWritten);
        transcribe2('audio.wav');

      }, 10000);
      console.log(transcribe2(audioStream.text))
      socket.emit('transcript', transcribe2(audioStream.text));
    })
    //transcribe2 transcribe
    //const transcriptionStream =  transcribe()
    //const transcriptionStream =  transcribe(data)

    //     socket.on('data',(data) => {
    //       try {
    //         // audioStream.write(data);
    //         // transcriptionStream.write(data);
    //         //stack.push(data);
    //         const transcripcionFinal = transcribe('audio.wav');
    //         // setTimeout(() =>{
    //         //   const audioBuffer = Buffer.from(data, 'base64');
    //         //   // Guardar el archivo de audio
    //         //   const filePath = `./audio/${Date.now()}.wav`;
    //         //   fs.writeFile(filePath, audioBuffer, (err) => {
    //         //     if (err) {
    //         //       console.error(err);
    //         //     } else {
    //         //       console.log('Audio file saved successfully');
    //         //     }
    //         //   });
    //         //   //const transcripcionFinal = transcribe('audio.wav');
    //         //   if (transcripcionFinal) {
    //         //     console.log('Transcript: ' + transcripcionFinal);
    //         //     socket.emit('transcript', transcripcionFinal);
    //         //   } else{
    //         //     console.log("No se recibió el audio");
    //         //   }
    //         //   // transcribe(data).on('data', (transcript) => {
    //         //   //   if (transcript) {
    //         //   //     console.log('Transcript: ' + transcript);
    //         //   //     socket.emit('transcript', transcript);
    //         //   //   } else{
    //         //   //     console.log("No se recibió el audio");
    //         //   //   }
    //         //   // });
    //         // },5000);
    //         //transcribe(data);
    //         // queue.send(data);
    //         // while (stack.length < 0){
    //         //   transcribe(queue.receive);
    //         // }
    //         // transcribe(data).on('data', (transcript) => {
    //         //   if (transcript) {
    //         //     console.log('Transcript: ' + transcript);
    //         //     socket.emit('transcript', transcript);
    //         //   } else{
    //         //     console.log("No se recibió el audio");
    //         //   }
    //         // });

    //         console.log('Transcript: ' + transcripcionFinal.text);
    //         socket.emit('transcript', transcripcionFinal.text);
    //       } catch (error) {
    //         console.log(error);
    //         socket.emit('error: ',error.message);
    //       }
    //     })

    socket.on('stop', () => {
      console.log('Grabación finalizada');
      audioStream.end();
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// async function transcribe(audio) {
//   try {
//     // Creamos una promesa para leer el archivo
//     const readFileAsData = new Promise((resolve, reject) => {
//       const fileStream = fs.createReadStream(audio);
//       fileStream.on('data', resolve);
//       fileStream.on('error', reject);
//     });

//     // Esperamos a que la promesa se resuelva
//     const fileData = await readFileAsData;

//     return await openai.audio.transcriptions.create({
//       model: "whisper-1",
//       language: "es",
//       file: fs.createReadStream(fileData),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

async function transcribe2(audio) {
  return await openai.audio.transcriptions.create({
    model: "whisper-1",
    language: "es",
    file: fs.createReadStream(audio)
  });
}



