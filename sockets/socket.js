const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();
console.log ('init server');

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Metalica'));
bands.addBand(new Band('Heroes del silencio'));
console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente Conectado');
    client.emit('active-bands',bands.getBands());
   
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
     });

     client.on('mensaje',(payload)=>{
         console.log('Mensaje ',payload);
         io.emit('mensaje',{admin: 'Nuevo mensaje'});
     });

     client.on('vote-band',(payload)=>{
         console.log(payload);
         bands.voteBand(payload.id);
         io.emit('active-bands',bands.getBands());  // todos los conectados incluido quein emite (vote)
     });
     client.on('add-band',(payload)=>{
        console.log(payload);
        const newBand = new Band(payload.name);
        bands.addBand(newBand)
        io.emit('active-bands',bands.getBands());  // todos los conectados incluido quein emite (vote)
    });
    client.on('delete-band',(payload)=>{
        console.log(payload);
        bands.deleteBand(payload.id)
        io.emit('active-bands',bands.getBands());  // todos los conectados incluido quein emite (vote)
    });
    //  client.on('emitir-mensaje',(payload)=>{
    //      console.log (payload);
    //     // io.emit('nuevo-mensaje',$payload); // Emite a todos
    //     client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos menos al que lo emitio
    //  });
}); 
  