// Modules
let express = require('express');
let http = require('http');
let socketio = require('socket.io');
let morgan = require('morgan');
let config = require('./config');

// Variables globales
const app = express();
const server = http.Server(app);
const io = socketio(server);
const port = config.express.port;
const options = {
  root: __dirname + '/views'
}

// Middlewares
app.use(express.static(options.root))
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  console.log();
  res.sendFile('index.html', options);
});

app.get('/params/:name', (req, res) => {
  res.send(req.params.name);
});

// IO
io.on('connection', socket => {
  console.log('user connected: ' + socket.id);

  // Déconnexion de l'utilisateur
  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
  });
});

// Lancement de l'application
server.listen(port, () => {
  console.log(`Serveur started on port ${port}`);
});