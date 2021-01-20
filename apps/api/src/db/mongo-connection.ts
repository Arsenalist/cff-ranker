const mongoose = require('mongoose');

function openMongo() {
  mongoose.connect('mongodb+srv://web:vxhxbwn3i3bXAk5@cluster0.lylny.mongodb.net/ranker?retryWrites=true&w=majority', { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Mongoose connection open');
  });
}

export { openMongo };
