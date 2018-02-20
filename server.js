//Turns raspberry pi connected led on/off via socket.io
const app = require('express')();
/*
* still don't understand why we need express and http; 
http object may be needed to initialize socket.io object
*/
const server = require('http').Server(app);
const io = require('socket.io')(server);
const express = require('express');
const staticAssets = __dirname + "/public";
const raspi = require('raspi-io'); //can only be installed on raspiberry pi machine
const five = require('johnny-five');
const board = new five.Board({
  io: new raspi()
});

app
    .use("/", express.static(staticAssets))
;

io.on('connection', function(socket) {
    console.log('Connected');

    socket.on('disconnect', function() {
        console.log('Disconnected');
    })
    
    socket.on('client-wave', function(wave) {
        console.log(wave.greeting);
        io.emit('server-wave', {
            greeting: 'Hello from server'
        });
        //led on
        board.on('ready', () => {
            // Create an Led on pin 7 on header P1 (GPIO4) and strobe it on/off
            const led = new five.Led('P1-7');
            led.strobe();
        });
    })

    socket.on('client-bye', function(wave) {
        console.log(wave.greeting);
        //led off
        board.on('ready', () => {
            const led = new five.Led('P1-7');
            led.strobe()
        });
         
        io.emit('server-wave', {
            greeting: 'Bye'
        });
    })
});

server.listen(3000, function(){
    console.log("Listening on port:3000");
});